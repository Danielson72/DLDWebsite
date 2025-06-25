import { ChevronDown, Music as MusicIcon, Play, Pause, ShoppingCart, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track, Artist } from '../types/music';
import { DotEdgeSides } from '../components/music/DotEdgeSides';
import { SignupModal } from '../components/auth/SignupModal';

export function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [processingTrack, setProcessingTrack] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

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
      } else {
        setTracks(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
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
    // Check if track has a Stripe Price ID
    if (!track.stripe_price_id) {
      alert('This track is not available for purchase yet. Please check back soon!');
      return;
    }

    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      setShowSignupModal(true);
      return;
    }

    setProcessingTrack(track.id);
    
    try {
      console.log('Initiating checkout for track:', track.title, 'with Price ID:', track.stripe_price_id);
      
      // Call the create-checkout Edge Function
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { 
          price_id: track.stripe_price_id,
          supabase_uid: session.user.id,
          track_id: track.id
        }
      });

      if (error) {
        console.error('Supabase function error:', error);
        alert(`Error processing payment: ${error.message || 'Please try again.'}`);
        return;
      }

      if (data?.url) {
        console.log('Redirecting to Stripe Checkout:', data.url);
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        console.error('No checkout URL returned:', data);
        alert('Error creating checkout session. Please try again.');
      }
    } catch (error: any) {
      console.error('Unexpected error during checkout:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setProcessingTrack(null);
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
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Hero background */}
        <div 
          className="absolute inset-0 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: "url('/ChatGPT Image Jun 6, 2025, 10_19_50 PM (1).png')" }}
        />

        {/* Green-dot edge panels */}
        <DotEdgeSides />

        {/* Artist Selection Buttons */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4 z-30 px-4">
          <button
            onClick={scrollToContent}
            className="px-6 py-3 font-bold rounded-lg shadow-lg bg-yellow-500 hover:bg-yellow-600 text-black transition-all transform hover:scale-105"
          >
            Daniel in the Lion's Den
          </button>
          <button
            onClick={scrollToContent}
            className="px-6 py-3 font-bold rounded-lg shadow-lg bg-yellow-500 hover:bg-yellow-600 text-black transition-all transform hover:scale-105"
          >
            The Tru Witnesses
          </button>
          <button
            onClick={scrollToContent}
            className="px-6 py-3 font-bold rounded-lg shadow-lg bg-yellow-500 hover:bg-yellow-600 text-black transition-all transform hover:scale-105"
          >
            Waves From IAM
          </button>
        </div>
        
        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-amber-500 hover:text-amber-400 transition-colors animate-bounce z-10"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Music Content Section */}
      <div id="music-content" className="relative bg-gradient-to-b from-green-900/20 to-black">
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <MusicIcon size={48} className="text-amber-500" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-6">
                Daniel in the Lion's Den Music
              </h1>
              <p className="text-xl text-emerald-400 max-w-2xl mx-auto mb-8">
                Support the mission by purchasing original Kingdom music crafted by Daniel in the Lion's Den.
              </p>
              
              {/* Payment Security Notice */}
              <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
                <p className="text-sm text-green-300">
                  🔒 Secure payments powered by Stripe
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  All transactions are encrypted and secure
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                <p className="text-amber-500">Loading tracks...</p>
              </div>
            ) : tracks.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-yellow-200 text-lg">No tracks available yet.</p>
                <p className="text-yellow-200/60 text-sm mt-2">Check back soon for new music releases.</p>
              </div>
            ) : (
              /* Track Listings by Artist */
              <div className="space-y-16">
                {Object.entries(tracksByArtist).map(([artist, artistTracks]) => (
                  <div key={artist}>
                    {/* Artist Header */}
                    <div className="text-center mb-12">
                      <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
                        {artist === 'DLD' ? 'Daniel in the Lion\'s Den' : artist} Tracks
                      </h2>
                      <div className="h-1 w-24 bg-gradient-to-r from-amber-500 to-green-400 rounded mx-auto"></div>
                    </div>

                    {/* Artist's Tracks */}
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {artistTracks.map((track) => {
                        const coverImageUrl = getCoverImageUrl(track);
                        const hasImageError = imageErrors.has(track.id);
                        
                        return (
                          <div
                            key={track.id}
                            className={`bg-black/60 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 hover:scale-105 ${
                              currentTrack?.id === track.id
                                ? 'border-yellow-400/50 bg-yellow-400/10'
                                : 'border-green-500/30 hover:border-green-400/50'
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
                                  <div className="bg-yellow-500 hover:bg-yellow-600 text-black rounded-full p-4 transition-colors shadow-lg">
                                    {currentTrack?.id === track.id && isPlaying ? (
                                      <Pause size={24} />
                                    ) : (
                                      <Play size={24} />
                                    )}
                                  </div>
                                </button>
                              )}
                              
                              {/* Artist Badge */}
                              <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-sm text-amber-500 text-xs font-bold px-2 py-1 rounded">
                                {artist === 'DLD' ? 'DLD' : artist}
                              </div>
                            </div>

                            {/* Track Info */}
                            <div className="text-center mb-4">
                              <h3 className="text-xl font-bold text-yellow-300 mb-2">{track.title}</h3>
                              <p className="text-green-200/80 text-sm">{track.artist}</p>
                              {track.description && (
                                <p className="text-green-200/60 text-xs mt-2 line-clamp-2">{track.description}</p>
                              )}
                            </div>

                            {/* Price and Buy Button */}
                            <div className="text-center">
                              <p className="text-green-200 font-mono font-bold text-2xl mb-4">
                                {formatPrice(track.price_cents)}
                              </p>
                              <button
                                onClick={() => handleBuyTrack(track)}
                                disabled={processingTrack === track.id || !track.stripe_price_id}
                                className={`w-full flex items-center justify-center gap-2 font-bold py-3 px-4 rounded-lg text-sm transition-colors ${
                                  processingTrack === track.id
                                    ? 'bg-gray-500 cursor-not-allowed text-white'
                                    : !track.stripe_price_id 
                                    ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                                    : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                                }`}
                              >
                                {processingTrack === track.id ? (
                                  <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                                    Processing...
                                  </>
                                ) : !track.stripe_price_id ? (
                                  'Coming Soon'
                                ) : (
                                  <>
                                    <ShoppingCart size={16} />
                                    Buy Now
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Audio Player for Current Track */}
                            {currentTrack?.id === track.id && getAudioUrl(track) && (
                              <div className="mt-4 pt-4 border-t border-green-500/20">
                                <div className="text-center mb-2">
                                  <span className="text-sm text-yellow-300">
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
            )}
          </div>
        </div>
      </div>

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