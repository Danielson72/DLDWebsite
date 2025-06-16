import { useState, useEffect } from 'react';
import { Download, Music, Calendar, DollarSign, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { PageHero } from '../components/PageHero';
import { AuthWrapper } from '../components/music/AuthWrapper';

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

export function Library() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(false);
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
        text: '🎉 Payment successful! Your purchase has been added to your library.'
      });
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Clear message after 5 seconds
      setTimeout(() => setMessage(null), 5000);
    }
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
      setMessage({ type: 'error', text: 'Failed to load your music library.' });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (trackId: string, trackTitle: string) => {
    setDownloadingTrack(trackId);
    setMessage(null);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Authentication required');
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

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="My Music Library" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          <AuthWrapper>
            {(user) => {
              // Fetch purchases when user is available
              useEffect(() => {
                if (user) {
                  fetchPurchases(user.id);
                }
              }, [user]);

              if (!user) {
                return (
                  <div className="text-center py-12">
                    <Music size={64} className="text-amber-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-amber-500 mb-4">Sign In Required</h2>
                    <p className="text-gray-300">Please sign in to view your music library.</p>
                  </div>
                );
              }

              return (
                <div>
                  {/* Status Message */}
                  {message && (
                    <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
                      message.type === 'success' 
                        ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                        : 'bg-red-900/20 border-red-500/30 text-red-300'
                    }`}>
                      {message.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                      <span>{message.text}</span>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                      <p className="text-amber-500">Loading your music library...</p>
                    </div>
                  ) : purchases.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12">
                      <Music size={64} className="text-amber-500 mx-auto mb-4" />
                      <h2 className="text-2xl font-bold text-amber-500 mb-4">No Music Yet</h2>
                      <p className="text-gray-300 mb-6">
                        You haven't purchased any tracks yet. Browse our music collection to get started!
                      </p>
                      <a
                        href="/music"
                        className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                      >
                        <Music size={20} />
                        Browse Music
                      </a>
                    </div>
                  ) : (
                    /* Purchases List */
                    <div>
                      <div className="flex items-center gap-3 mb-8">
                        <Music size={32} className="text-amber-500" />
                        <div>
                          <h2 className="text-2xl font-bold text-amber-500">Your Music Collection</h2>
                          <p className="text-gray-300">{purchases.length} track{purchases.length !== 1 ? 's' : ''} purchased</p>
                        </div>
                      </div>

                      <div className="grid gap-4">
                        {purchases.map((purchase) => (
                          <div
                            key={purchase.id}
                            className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-amber-500/50 transition-all duration-300"
                          >
                            <div className="flex items-center gap-4">
                              {/* Cover Image */}
                              <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                                {purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url ? (
                                  <img
                                    src={purchase.music_tracks.cover_image_url || purchase.music_tracks.cover_url}
                                    alt={`${purchase.music_tracks.title} cover`}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <Music size={24} />
                                  </div>
                                )}
                              </div>

                              {/* Track Info */}
                              <div className="flex-1 min-w-0">
                                <h3 className="text-lg font-bold text-amber-500 truncate">
                                  {purchase.music_tracks.title}
                                </h3>
                                <p className="text-green-200/80">{purchase.music_tracks.artist}</p>
                                
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                                  <div className="flex items-center gap-1">
                                    <Calendar size={14} />
                                    <span>Purchased {formatDate(purchase.purchased_at)}</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <DollarSign size={14} />
                                    <span>{formatPrice(purchase.amount_cents, purchase.currency)}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Download Button */}
                              <div className="flex-shrink-0">
                                <button
                                  onClick={() => handleDownload(purchase.track_id, purchase.music_tracks.title)}
                                  disabled={downloadingTrack === purchase.track_id}
                                  className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-lg transition-colors"
                                >
                                  {downloadingTrack === purchase.track_id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                                      Downloading...
                                    </>
                                  ) : (
                                    <>
                                      <Download size={16} />
                                      Download
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            }}
          </AuthWrapper>
        </div>
      </div>
    </div>
  );
}