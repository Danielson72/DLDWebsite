import { ChevronDown, Music as MusicIcon, Play, Pause, ShoppingCart, User } from 'lucide-react';
import { AlertCircle, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track, Artist } from '../types/music';
import { SignupModal } from '../components/auth/SignupModal';
import { MusicPlayerV2 } from '../components/music/MusicPlayer-v2';
import { buyTrack } from '../lib/checkout';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';

export function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [processingTrack, setProcessingTrack] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);

  // Check if new checkout feature is enabled
  const useNewCheckout = import.meta.env.VITE_FEATURE_NEW_CHECKOUT === 'true';

  // Listen for checkout errors
  useEffect(() => {
    const handleCheckoutError = (event: any) => {
      setErrorMessage(event.detail.message);
      // Clear error after 5 seconds
      setTimeout(() => setErrorMessage(null), 5000);
    };

    window.addEventListener('checkout-error', handleCheckoutError);
    return () => window.removeEventListener('checkout-error', handleCheckoutError);
  }, []);

  // User auth state for new checkout flow
  useEffect(() => {
    if (useNewCheckout) {
      // Get initial session
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
      });

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    }
  }, [useNewCheckout]);

  // Fetch all tracks on component mount
  useEffect(() => {
    fetchTracks();
    
    // Check for successful payment on page load
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      alert('🎉 Payment successful! You can now access your purchased music in your account.');
      window.location.href = '/my-music';
    }
    
    if (urlParams.get('canceled') === 'true') {
      alert('Payment was canceled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('is_active', true)
        .order('artist', { ascending: true })
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tracks:', error);
        alert(`Failed to load tracks: ${error.message} (Status: ${error.status || 'unknown'})`);
      } else {
        setTracks(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      alert(`Unexpected error loading tracks: ${err instanceof Error ? err.message : String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getAudioUrl = (track: Track) => {
    // For now, use preview_url if available, otherwise audio_preview, then audio_full
    return track.preview_url || track.audio_preview || track.audio_full;
  };

  const getCoverImageUrl = (track: Track) => {
    // Prioritize cover_image_url, then fall back to cover_url
    return track.cover_image_url || track.cover_url;
  };

  const handleImageError = (trackId: string) => {
    setImageErrors(prev => new Set([...prev, trackId]));
  };

  const handlePlayPause = (track: Track) => {
    const audioUrl = getAudioUrl(track);
    
    if (!audioUrl) {
      alert('Audio not available for this track');
      return;
    }

    if (currentTrack?.id === track.id) {
      // Same track - toggle play/pause
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
        } else {
          audioElement.play();
        }
      }
    } else {
      // Different track - stop current and play new
      if (audioElement) {
        audioElement.pause();
        audioElement.currentTime = 0;
      }
      
      const audio = new Audio(audioUrl);
      audio.addEventListener('play', () => setIsPlaying(true));
      audio.addEventListener('pause', () => setIsPlaying(false));
      audio.addEventListener('ended', () => {
        setIsPlaying(false);
        setCurrentTrack(null);
      });
      
      setAudioElement(audio);
      setCurrentTrack(track);
      audio.play();
    }
  };

  const handleBuyTrack = async (track: Track) => {
    try {
      await buyTrack(track);
    } catch (error: any) {
      if (error.message !== 'NO_SESSION') {
        // Display error toast for non-auth errors
        setErrorMessage(error.message || 'Checkout failed');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('music-content');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  // Group tracks by artist
  const tracksByArtist = tracks.reduce((acc, track) => {
    if (!acc[track.artist]) {
      acc[track.artist] = [];
    }
    acc[track.artist].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: '#001315' }}>
      <DLDNav />

      {/* Hero Section */}
      <section className="relative w-full py-24 px-6 text-center" style={{ background: '#000e0f' }}>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4 font-manrope">
          Kingdom Music
        </span>
        <h1 className="font-newsreader text-4xl md:text-5xl text-[#EEC14E] font-bold mb-4">
          Daniel in the Lion's Den Music
        </h1>
        <p className="text-dld-muted font-manrope max-w-md mx-auto mb-8">
          Support the mission by purchasing original Kingdom music.
        </p>

        {/* Artist Selection Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 px-4">
          <button
            onClick={scrollToContent}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 font-manrope font-bold rounded-full shadow-lg bg-[#EEC14E] hover:bg-[#F7D97A] text-[#001315] transition-all transform hover:scale-105 text-sm sm:text-base uppercase tracking-widest"
          >
            Daniel in the Lion's Den
          </button>
          <button
            onClick={scrollToContent}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 font-manrope font-bold rounded-full shadow-lg border border-[#EEC14E]/30 text-[#EEC14E]/60 hover:bg-[#EEC14E] hover:text-[#001315] transition-all transform hover:scale-105 text-sm sm:text-base uppercase tracking-widest"
          >
            The Tru Witnesses
          </button>
          <button
            onClick={scrollToContent}
            className="w-full sm:w-auto px-4 sm:px-6 py-3 font-manrope font-bold rounded-full shadow-lg border border-[#EEC14E]/30 text-[#EEC14E]/60 hover:bg-[#EEC14E] hover:text-[#001315] transition-all transform hover:scale-105 text-sm sm:text-base uppercase tracking-widest"
          >
            Waves From IAM
          </button>
        </div>
      </section>

      <ScriptureBanner
        verse="Sing to him a new song; play skillfully, and shout for joy."
        reference="— Psalm 33:3 (NIV)" />

      {/* Music Content Section */}
      <div id="music-content" className="relative overflow-x-hidden" style={{ background: '#091f21' }}>
        <div className="relative py-12 sm:py-16 lg:py-24 overflow-hidden">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Error Toast */}
            {errorMessage && (
              <div className="fixed top-20 right-4 bg-red-900/90 backdrop-blur-sm border border-red-500/30 text-red-300 p-4 rounded-lg shadow-lg z-50 max-w-sm">
                <div className="flex items-center gap-3">
                  <AlertCircle size={20} />
                  <div>
                    <p className="font-medium">Checkout Error</p>
                    <p className="text-sm">{errorMessage}</p>
                  </div>
                  <button
                    onClick={() => setErrorMessage(null)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Header */}
            <div className="text-center mb-8 sm:mb-12 lg:mb-16">
              <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-3 font-manrope">
                Browse & Purchase
              </span>
              <h2 className="font-newsreader text-3xl md:text-4xl text-[#EEC14E] font-bold mb-4">
                Available Tracks
              </h2>
              <p className="text-dld-muted font-manrope max-w-2xl mx-auto mb-6 sm:mb-8">
                Support the mission by purchasing original Kingdom music crafted by Daniel in the Lion's Den.
              </p>

              {/* Payment Security Notice */}
              <div className="bg-[#192d2f] border border-[#EEC14E]/20 rounded-lg p-3 sm:p-4 max-w-sm sm:max-w-md mx-auto">
                <p className="text-sm text-dld-text font-manrope">
                  Secure payments powered by Stripe
                </p>
                <p className="text-xs text-dld-muted/60 mt-1 font-manrope">
                  All transactions are encrypted and secure
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#EEC14E] mx-auto mb-4"></div>
                <p className="text-[#EEC14E] font-manrope">Loading tracks...</p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-dld-text text-lg font-manrope">No tracks available yet.</p>
                <p className="text-dld-muted/60 text-sm mt-2 font-manrope">Check back soon for new music releases.</p>
              </div>
            ) : (
              /* Track Listings by Artist */
              useNewCheckout ? (
                <MusicPlayerV2 tracks={tracks} user={user} />
              ) : (
                <div className="space-y-12 sm:space-y-16">
                  {Object.entries(tracksByArtist).map(([artist, artistTracks]) => (
                    <div key={artist}>
                      {/* Artist Header */}
                      <div className="text-center mb-8 sm:mb-12">
                        <h2 className="font-newsreader text-2xl md:text-3xl font-bold text-[#EEC14E] mb-4">
                          {artist === 'DLD' ? 'Daniel in the Lion\'s Den' : artist} Tracks
                        </h2>
                        <div className="h-0.5 w-16 sm:w-24 bg-[#EEC14E]/40 rounded mx-auto"></div>
                      </div>

                      {/* Artist's Tracks */}
                      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {artistTracks.map((track) => {
                          const coverImageUrl = getCoverImageUrl(track);
                          const hasImageError = imageErrors.has(track.id);
                          
                          return (
                            <div
                              key={track.id}
                              className={`bg-[#192d2f] border rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
                                currentTrack?.id === track.id
                                  ? 'border-[#EEC14E]/50 bg-[#EEC14E]/10'
                                  : 'border-[#EEC14E]/20 hover:border-[#EEC14E]/40'
                              }`}
                            >
                              {/* Cover Image */}
                              <div className="relative w-full aspect-square bg-gray-800 rounded-lg overflow-hidden mb-4 group">
                                {coverImageUrl && !hasImageError ? (
                                  <img
                                    src={coverImageUrl}
                                    alt={`${track.title} album art`}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                    onError={() => handleImageError(track.id)}
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gradient-to-br from-gray-800 to-gray-900">
                                    <div className="text-center">
                                      <MusicIcon size={48} className="mx-auto mb-2 opacity-50" />
                                      <p className="text-xs text-gray-400">Album Art</p>
                                    </div>
                                  </div>
                                )}
                                
                                {/* Play Button Overlay */}
                                {getAudioUrl(track) && (
                                  <button
                                    onClick={() => handlePlayPause(track)}
                                    className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center"
                                  >
                                    <div className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-3 sm:p-4 transition-colors shadow-lg">
                                      {currentTrack?.id === track.id && isPlaying ? (
                                        <Pause size={20} className="sm:size-6" />
                                      ) : (
                                        <Play size={20} className="sm:size-6" />
                                      )}
                                    </div>
                                  </button>
                                )}
                                
                                {/* Artist Badge */}
                                <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-[#001315]/80 backdrop-blur-sm text-[#EEC14E] text-xs font-manrope font-bold px-2 py-1 rounded">
                                  {artist === 'DLD' ? 'DLD' : artist}
                                </div>
                              </div>

                              {/* Track Info */}
                              <div className="text-center mb-4">
                                <h3 className="text-lg sm:text-xl font-newsreader font-bold text-[#EEC14E] mb-2 line-clamp-2">{track.title}</h3>
                                <p className="text-dld-muted font-manrope text-sm">{track.artist}</p>
                                {track.description && (
                                  <p className="text-dld-muted/60 font-manrope text-xs mt-2 line-clamp-3">{track.description}</p>
                                )}
                              </div>

                              {/* Price and Buy Button */}
                              <div className="text-center">
                                <p className="text-dld-text font-manrope font-bold text-xl sm:text-2xl mb-4">
                                  {formatPrice(track.price_cents)}
                                </p>
                                <button
                                  onClick={() => handleBuyTrack(track)}
                                  disabled={processingTrack === track.id || !track.stripe_price_id}
                                  className={`w-full flex items-center justify-center gap-2 font-bold py-2.5 sm:py-3 px-4 rounded-lg text-sm transition-colors ${
                                    processingTrack === track.id
                                      ? 'bg-gray-500 cursor-not-allowed text-white'
                                      : !track.stripe_price_id 
                                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                      : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                  }`}
                                >
                                  {processingTrack === track.id ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                                      <span className="hidden sm:inline">Processing...</span>
                                      <span className="sm:hidden">...</span>
                                    </>
                                  ) : !track.stripe_price_id ? (
                                    'Coming Soon'
                                  ) : (
                                    <>
                                      <ShoppingCart size={14} className="sm:size-4" />
                                      Buy Now
                                    </>
                                  )}
                                </button>
                              </div>

                              {/* Audio Player for Current Track */}
                              {currentTrack?.id === track.id && getAudioUrl(track) && (
                                <div className="mt-4 pt-4 border-t border-[#EEC14E]/20">
                                  <div className="text-center mb-2">
                                    <span className="text-xs sm:text-sm text-[#EEC14E] font-manrope">
                                      🎵 Preview
                                    </span>
                                  </div>
                                  <audio
                                    src={getAudioUrl(track)}
                                    controls
                                    className="w-full accent-yellow-400"
                                    onPlay={() => setIsPlaying(true)}
                                    onPause={() => setIsPlaying(false)}
                                    onEnded={() => {
                                      setIsPlaying(false);
                                      setCurrentTrack(null);
                                    }}
                                  />
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <DLDFooter />

      {/* Signup Modal */}
      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSuccess={() => {
          setShowSignupModal(false);
          // Refresh the page to update auth state
          window.location.reload();
        }}
      />
    </div>
  );
}