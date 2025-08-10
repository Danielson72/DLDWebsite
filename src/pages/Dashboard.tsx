import { useState, useEffect } from 'react';
import { User, Music, ShoppingBag, Download, Calendar, DollarSign, TrendingUp, Play } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AuthGuard } from '../components/auth/AuthGuard';
import { PageHero } from '../components/PageHero';

interface DashboardStats {
  totalPurchases: number;
  totalSpent: number;
  tracksOwned: number;
  lastPurchase: string | null;
}

interface Purchase {
  id: string;
  track_id: string;
  amount_cents: number;
  currency: string;
  purchased_at: string;
  status: string;
  music_tracks: {
    id: string;
    title: string;
    artist: string;
    cover_image_url: string | null;
    cover_url: string | null;
  };
}

interface UserProfile {
  display_name: string | null;
  phone: string | null;
  created_at: string | null;
}

type TabType = 'overview' | 'orders' | 'library';

export function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalPurchases: 0,
    totalSpent: 0,
    tracksOwned: 0,
    lastPurchase: null,
  });
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get user and fetch data
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser(user);
        fetchUserData(user.id);
      }
    });
  }, []);

  const fetchUserData = async (userId: string) => {
    try {
      // Fetch user profile
      const { data: profileData } = await supabase
        .from('user_profiles')
        .select('display_name, phone, created_at')
        .eq('user_id', userId)
        .single();

      setProfile(profileData);

      // Fetch purchases with track details
      const { data: purchasesData, error: purchasesError } = await supabase
        .from('purchases')
        .select(`
          *,
          music_tracks (
            id,
            title,
            artist,
            cover_image_url,
            cover_url
          )
        `)
        .eq('user_id', userId)
        .eq('status', 'paid')
        .order('purchased_at', { ascending: false });

      if (purchasesError) throw purchasesError;

      setPurchases(purchasesData || []);

      // Calculate stats
      const totalSpent = (purchasesData || []).reduce((sum, p) => sum + p.amount_cents, 0);
      const lastPurchase = purchasesData && purchasesData.length > 0 ? purchasesData[0].purchased_at : null;

      setStats({
        totalPurchases: purchasesData?.length || 0,
        totalSpent,
        tracksOwned: purchasesData?.length || 0,
        lastPurchase,
      });

    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleDownload = async (trackId: string, trackTitle: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to download your music.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/get-signed-url?track_id=${trackId}`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get download link');
      }

      const { download_url, filename } = await response.json();

      // Trigger download
      const link = document.createElement('a');
      link.href = download_url;
      link.download = filename || `${trackTitle}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

    } catch (error: any) {
      console.error('Download error:', error);
      alert(`Failed to download "${trackTitle}": ${error.message}`);
    }
  };

  const tabs = [
    { id: 'overview' as TabType, label: 'Overview', icon: TrendingUp },
    { id: 'orders' as TabType, label: 'Orders', icon: ShoppingBag },
    { id: 'library' as TabType, label: 'My Library', icon: Music },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <PageHero title="Dashboard" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          {/* Welcome Section */}
          <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 rounded-full">
                <User size={24} className="text-amber-500" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-amber-500">
                  Welcome back, {profile?.display_name || user?.email?.split('@')[0] || 'User'}!
                </h2>
                <p className="text-gray-300">
                  Signed in as: {user?.email}
                </p>
                {profile?.created_at && (
                  <p className="text-sm text-gray-400">
                    Member since {formatDate(profile.created_at)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-green-500/30 mb-8 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'text-amber-500 border-b-2 border-amber-500'
                    : 'text-gray-400 hover:text-green-300'
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <ShoppingBag size={20} className="text-amber-500" />
                    <span className="text-sm text-gray-400">Total Orders</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.totalPurchases}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign size={20} className="text-green-500" />
                    <span className="text-sm text-gray-400">Total Spent</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{formatCurrency(stats.totalSpent)}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Music size={20} className="text-blue-500" />
                    <span className="text-sm text-gray-400">Tracks Owned</span>
                  </div>
                  <p className="text-2xl font-bold text-white">{stats.tracksOwned}</p>
                </div>

                <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar size={20} className="text-purple-500" />
                    <span className="text-sm text-gray-400">Last Purchase</span>
                  </div>
                  <p className="text-sm font-medium text-white">
                    {stats.lastPurchase ? formatDate(stats.lastPurchase) : 'None yet'}
                  </p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-500 mb-4">Recent Activity</h3>
                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <Music size={48} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No purchases yet</p>
                    <a
                      href="/music"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Music size={16} />
                      Browse Music
                    </a>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {purchases.slice(0, 5).map((purchase) => (
                      <div key={purchase.id} className="flex items-center gap-4 p-3 bg-black/40 rounded-lg">
                        <div className="w-10 h-10 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url ? (
                            <img
                              src={purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <Music size={16} />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-amber-500 font-medium truncate">
                            {purchase.music_tracks.title}
                          </p>
                          <p className="text-gray-400 text-sm">
                            {purchase.music_tracks.artist} • {formatDate(purchase.purchased_at)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-green-300 font-bold">
                            {formatCurrency(purchase.amount_cents)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-500 mb-4">Order History</h3>
                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag size={48} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No orders yet</p>
                    <a
                      href="/music"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Music size={16} />
                      Start Shopping
                    </a>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="border border-green-500/20 rounded-lg p-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            {purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url ? (
                              <img
                                src={purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url}
                                alt="Cover"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Music size={20} />
                              </div>
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <h4 className="text-amber-500 font-bold">
                              {purchase.music_tracks.title}
                            </h4>
                            <p className="text-green-200/80">{purchase.music_tracks.artist}</p>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                              <span>Order #{purchase.id.slice(0, 8)}</span>
                              <span>{formatDate(purchase.purchased_at)}</span>
                              <span className="capitalize bg-green-900/20 text-green-300 px-2 py-1 rounded text-xs">
                                {purchase.status}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <p className="text-green-300 font-bold text-lg">
                              {formatCurrency(purchase.amount_cents)}
                            </p>
                            <button
                              onClick={() => handleDownload(purchase.track_id, purchase.music_tracks.title)}
                              className="mt-2 flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-black font-medium px-3 py-1 rounded text-sm transition-colors"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'library' && (
            <div className="space-y-6">
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-amber-500">My Music Library</h3>
                  <span className="text-sm text-gray-400">
                    {stats.tracksOwned} track{stats.tracksOwned !== 1 ? 's' : ''}
                  </span>
                </div>

                {purchases.length === 0 ? (
                  <div className="text-center py-8">
                    <Music size={48} className="text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">Your music library is empty</p>
                    <a
                      href="/music"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      <Music size={16} />
                      Browse Music
                    </a>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {purchases.map((purchase) => (
                      <div key={purchase.id} className="flex items-center gap-4 p-4 border border-green-500/20 rounded-lg hover:border-amber-500/30 transition-colors">
                        <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                          {purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url ? (
                            <img
                              src={purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url}
                              alt="Cover"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500">
                              <Music size={24} />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className="text-amber-500 font-bold text-lg">
                            {purchase.music_tracks.title}
                          </h4>
                          <p className="text-green-200/80">{purchase.music_tracks.artist}</p>
                          <p className="text-gray-400 text-sm">
                            Purchased {formatDate(purchase.purchased_at)}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleDownload(purchase.track_id, purchase.music_tracks.title)}
                            className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
                          >
                            <Download size={16} />
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}