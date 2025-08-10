import { useState, useEffect } from 'react';
import { Play, Pause, ShoppingCart, Music as MusicIcon, AlertCircle, X } from 'lucide-react';
import { Track } from '../../types/music';
import { buyTrack } from '../../lib/checkout';
import { supabase } from '../../lib/supabase';
import { User } from '@supabase/supabase-js';

interface MusicPlayerV2Props {
  tracks: Track[];
  user: User | null;
}

export function MusicPlayerV2({ tracks, user }: MusicPlayerV2Props) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [processingTrack, setProcessingTrack] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Listen for auth modal events
  useEffect(() => {
    const handleCheckoutError = (event: any) => {
      setErrorMessage(event.detail.message);
      setTimeout(() => setErrorMessage(null), 5000);
    };

    const handleOpenAuthModal = () => {
      // Dispatch event to open auth modal in Layout component
      const evt = new CustomEvent('show-auth-modal');
      window.dispatchEvent(evt);
    };

    window.addEventListener('checkout-error', handleCheckoutError);
    window.addEventListener('open-auth-modal', handleOpenAuthModal);
    return () => {
      window.removeEventListener('checkout-error', handleCheckoutError);
      window.removeEventListener('open-auth-modal', handleOpenAuthModal);
    };
  }, []);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const getAudioUrl = (track: Track) => {
    return track.preview_url || track.audio_preview || track.audio_full;
  };

  const getCoverImageUrl = (track: Track) => {
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
      if (audioElement) {
        if (isPlaying) {
          audioElement.pause();
        } else {
          audioElement.play();
        }
      }
    } else {
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
    await buyTrack(track);
  };

  // Group tracks by artist
  const tracksByArtist = tracks.reduce((acc, track) => {
    if (!acc[track.artist]) {
      acc[track.artist] = [];
    }
    acc[track.artist].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

  if (tracks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-yellow-200 text-lg">No tracks available yet.</p>
        <p className="text-yellow-200/60 text-sm mt-2">Check back soon for new music releases.</p>
      </div>
    );
  }

  return (
    <div className="relative space-y-12 sm:space-y-16">
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

      {Object.entries(tracksByArtist).map(([artist, artistTracks]) => (
        <div key={artist}>
          {/* Artist Header */}
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4">
              {artist === 'DLD' ? 'Daniel in the Lion\'s Den' : artist} Tracks
            </h2>
            <div className="h-1 w-16 sm:w-24 bg-gradient-to-r from-amber-500 to-green-400 rounded mx-auto"></div>
          </div>

          {/* Artist's Tracks */}
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {artistTracks.map((track) => {
              const coverImageUrl = getCoverImageUrl(track);
              const hasImageError = imageErrors.has(track.id);
              
              return (
                <div
                  key={track.id}
                  className={`bg-black/60 backdrop-blur-sm border rounded-lg p-4 sm:p-6 transition-all duration-300 hover:scale-105 ${
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
                    <div className="absolute top-2 sm:top-3 left-2 sm:left-3 bg-black/80 backdrop-blur-sm text-amber-500 text-xs font-bold px-2 py-1 rounded">
                      {artist === 'DLD' ? 'DLD' : artist}
                    </div>
                  </div>

                  {/* Track Info */}
                  <div className="text-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-yellow-300 mb-2 line-clamp-2">{track.title}</h3>
                    <p className="text-green-200/80 text-sm">{track.artist}</p>
                    {track.description && (
                      <p className="text-green-200/60 text-xs mt-2 line-clamp-3">{track.description}</p>
                    )}
                  </div>

                  {/* Price and Buy Button */}
                  <div className="text-center">
                    <p className="text-green-200 font-mono font-bold text-xl sm:text-2xl mb-4">
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
                    <div className="mt-4 pt-4 border-t border-green-500/20">
                      <div className="text-center mb-2">
                        <span className="text-xs sm:text-sm text-yellow-300">
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
  );
}