import { useState, useEffect } from 'react';
import { Download, Music, Calendar, DollarSign, AlertCircle, CheckCircle, User, LogIn } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from '../components/PageHero';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface Purchase {
  id: string;
  track_id: string;
  amount_cents: number;
  currency: string;
  purchased_at: string;
  music_tracks: {
    id: string;
    title: string;
    artist: string;
    cover_image_url: string | null;
    cover_url: string | null;
  };
}

export function MyMusic() {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [downloadingTrack, setDownloadingTrack] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      setMessage({
        type: 'success',
        text: '🎉 Payment successful! Your purchase has been added to your music collection.'
      });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
  }, []);

  // Authentication check
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchPurchases(session.user.id);
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setAuthLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      
      if (session?.user) {
        await fetchPurchases(session.user.id);
      } else {
        setPurchases([]);
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchPurchases = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
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

      if (error) throw error;
      setPurchases(data || []);
    } catch (error: any) {
      console.error('Error fetching purchases:', error);
      setMessage({ type: 'error', text: 'Failed to load your music collection.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (trackId: string, trackTitle: string) => {
    setDownloadingTrack(trackId);
    setMessage(null);

    try {
      const { data, error } = await supabase.functions.invoke('getSignedUrl', { body: { track_id: trackId } })
      if (error) { 
        throw new Error(error.message)
      }
      window.location.href = (data as any).url

      setMessage({ type: 'success', text: `Download started for "${trackTitle}"` });
    } catch (error: any) {
      console.error('Download error:', error);
      setMessage({ type: 'error', text: `Failed to download "${trackTitle}": ${error.message}` });
    } finally {
      setDownloadingTrack(null);
    }
  };

  const formatPrice = (cents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(cents / 100);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <PageHero title="My Music Collection" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          {/* Authentication Required */}
          {!user ? (
            <div className="text-center py-12">
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 sm:p-8 max-w-sm sm:max-w-md mx-auto">
                <User size={48} className="sm:size-16 text-amber-500 mx-auto mb-4" />
                <h2 className="responsive-heading-md font-bold text-amber-500 mb-4">Sign In Required</h2>
                <p className="text-gray-300 mb-6 text-sm sm:text-base">
                  Please sign in to access your purchased music collection.
                </p>
                <div className="space-y-3 sm:space-y-4">
                  <a
                    href="/login"
                    className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                  >
                    <LogIn size={16} className="sm:size-5" />
                    Sign In
                  </a>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Don't have an account? <a href="/register" className="text-amber-500 hover:text-amber-400">Register here</a>
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Status Message */}
              {message && (
                <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-center gap-3 ${
                  message.type === 'success' 
                    ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                    : 'bg-red-900/20 border-red-500/30 text-red-300'
                }`}>
                  {message.type === 'success' ? <CheckCircle size={16} className="sm:size-5" /> : <AlertCircle size={16} className="sm:size-5" />}
                  <span className="text-sm sm:text-base">{message.text}</span>
                </div>
              )}

              {/* User Welcome */}
              <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 sm:p-6 mb-6 sm:mb-8">
                <div className="flex items-center gap-3">
                  <User size={20} className="sm:size-6 text-amber-500" />
                  <div>
                    <h2 className="text-lg sm:text-xl font-bold text-amber-500">Welcome back!</h2>
                    <p className="text-gray-300 text-sm sm:text-base">Signed in as: <span className="font-medium">{user.email}</span></p>
                  </div>
                </div>
              </div>

              {/* Loading State */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p className="text-amber-500">Loading your music collection...</p>
                </div>
              ) : purchases.length === 0 ? (
                /* Empty State */
                <div className="text-center py-12">
                  <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-6 sm:p-8">
                    <Music size={48} className="sm:size-16 text-amber-500 mx-auto mb-4" />
                    <h2 className="responsive-heading-md font-bold text-amber-500 mb-4">No Music Yet</h2>
                    <p className="text-gray-300 mb-6 text-sm sm:text-base">
                      You haven't purchased any tracks yet. Browse our music collection to get started!
                    </p>
                    <a
                      href="/music"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      <Music size={16} className="sm:size-5" />
                      Browse Music
                    </a>
                  </div>
                </div>
              ) : (
                /* Purchases List */
                <div>
                  <div className="flex items-center gap-3 mb-6 sm:mb-8">
                    <Music size={24} className="sm:size-8 text-amber-500" />
                    <div>
                      <h2 className="responsive-heading-md font-bold text-amber-500">Your Music Collection</h2>
                      <p className="text-gray-300 text-sm sm:text-base">{purchases.length} track{purchases.length !== 1 ? 's' : ''} purchased</p>
                    </div>
                  </div>

                  <div className="grid gap-4">
                    {purchases.map((purchase) => (
                      <div
                        key={purchase.id}
                        className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 sm:p-6 hover:border-amber-500/50 transition-all duration-300"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                          {/* Cover Image */}
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                            {purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url ? (
                              <img
                                src={purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url}
                                alt={`${purchase.music_tracks.title} cover`}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-500">
                                <Music size={20} className="sm:size-6" />
                              </div>
                            )}
                          </div>

                          {/* Track Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg sm:text-xl font-bold text-amber-500 truncate">
                              {purchase.music_tracks.title}
                            </h3>
                            <p className="text-green-200/80 text-sm sm:text-base">{purchase.music_tracks.artist}</p>
                            
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2 text-xs sm:text-sm text-gray-400">
                              <div className="flex items-center gap-1">
                                <Calendar size={12} className="sm:size-4" />
                                <span>Purchased {formatDate(purchase.purchased_at)}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <DollarSign size={12} className="sm:size-4" />
                                <span>{formatPrice(purchase.amount_cents, purchase.currency)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Download Button */}
                          <div className="w-full sm:w-auto flex-shrink-0">
                            <button
                              onClick={() => handleDownload(purchase.track_id, purchase.music_tracks.title)}
                              disabled={downloadingTrack === purchase.track_id}
                              className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2.5 rounded-lg transition-colors text-sm sm:text-base"
                            >
                              {downloadingTrack === purchase.track_id ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                  <span className="hidden sm:inline">Downloading...</span>
                                  <span className="sm:hidden">...</span>
                                </>
                              ) : (
                                <>
                                  <Download size={14} className="sm:size-4" />
                                  Download
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Browse More Music */}
                  <div className="mt-8 sm:mt-12 text-center">
                    <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-xl p-6 sm:p-8">
                      <h3 className="responsive-heading-md font-bold text-amber-500 mb-4">
                        Looking for More Music?
                      </h3>
                      <p className="text-gray-300 mb-6 text-sm sm:text-base">
                        Discover more Kingdom music and support the ministry.
                      </p>
                      <a
                        href="/music"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        <Music size={16} className="sm:size-5" />
                        Browse All Music
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}