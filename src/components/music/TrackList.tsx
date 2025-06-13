import { useState } from 'react';
import { Play, Pause, ShoppingCart, Trash2, AlertTriangle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { Track } from '../../types/music';
import { supabase } from '../../lib/supabase';

interface TrackListProps {
  tracks: Track[];
  user: User | null;
  onTrackDeleted: () => void;
}

export function TrackList({ tracks, user, onTrackDeleted }: TrackListProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [deletingTrack, setDeletingTrack] = useState<string | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handlePlayPause = (track: Track) => {
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
      
      if (track.audio_preview) {
        const audio = new Audio(track.audio_preview);
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
    }
  };

  const handleBuyTrack = async (track: Track) => {
    // Check if track has a Stripe Price ID
    if (!track.stripe_price_id) {
      alert('This track is not available for purchase yet. Please contact support.');
      return;
    }

    setIsProcessing(true);
    
    try {
      console.log('Initiating checkout for track:', track.title, 'with Price ID:', track.stripe_price_id);
      
      // Call the Supabase Edge Function with the track ID
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { trackId: track.id }
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
    } catch (error) {
      console.error('Unexpected error during checkout:', error);
      alert('An unexpected error occurred. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteTrack = async (track: Track) => {
    if (!user) return;
    
    if (!confirm(`Delete "${track.title}" permanently? This action cannot be undone.`)) {
      return;
    }

    setDeletingTrack(track.id);

    try {
      // Delete storage files
      const deletePromises = [];
      
      if (track.audio_full) {
        const pathParts = track.audio_full.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
          );
        }
      }
      
      if (track.audio_preview && track.audio_preview !== track.audio_full) {
        const pathParts = track.audio_preview.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
          );
        }
      }
      
      if (track.cover_url) {
        const pathParts = track.cover_url.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
          );
        }
      }

      // Execute storage deletions (ignore errors for missing files)
      await Promise.allSettled(deletePromises);

      // Delete database record
      const { error } = await supabase
        .from('music_tracks')
        .delete()
        .eq('id', track.id);

      if (error) {
        throw error;
      }

      // Stop playing if this track was current
      if (currentTrack?.id === track.id) {
        if (audioElement) {
          audioElement.pause();
        }
        setCurrentTrack(null);
        setIsPlaying(false);
      }

      onTrackDeleted();

    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete track: ${error.message}`);
    } finally {
      setDeletingTrack(null);
    }
  };

  if (!tracks.length) {
    return (
      <div className="text-center py-12">
        <p className="text-yellow-200 text-lg">No tracks available yet.</p>
        <p className="text-yellow-200/60 text-sm mt-2">
          {user ? 'Upload your first track to get started!' : 'Sign in to upload tracks.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-yellow-300 mb-4">Music Tracks</h3>
      
      <div className="grid gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className={`bg-black/40 p-4 rounded-lg border transition-all ${
              currentTrack?.id === track.id
                ? 'border-yellow-400/50 bg-yellow-400/10'
                : 'border-green-500/30 hover:border-green-400/50'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Cover Image */}
              {track.cover_url && (
                <img
                  src={track.cover_url}
                  alt={`${track.title} cover`}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              
              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-yellow-300 font-semibold truncate">{track.title}</h4>
                  {user && (
                    <button
                      onClick={() => handleDeleteTrack(track)}
                      disabled={deletingTrack === track.id}
                      className="p-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded transition-colors"
                      title="Delete track"
                    >
                      {deletingTrack === track.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                      ) : (
                        <Trash2 size={12} />
                      )}
                    </button>
                  )}
                </div>
                <p className="text-green-200/80 text-sm">{track.artist}</p>
                {track.description && (
                  <p className="text-green-200/60 text-sm mt-1 line-clamp-2">{track.description}</p>
                )}
                {/* Show Stripe Price ID for debugging (remove in production) */}
                {track.stripe_price_id && (
                  <p className="text-xs text-gray-500 mt-1 font-mono">
                    Price ID: {track.stripe_price_id}
                  </p>
                )}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                {/* Play/Pause Button */}
                {track.audio_preview && (
                  <button
                    onClick={() => handlePlayPause(track)}
                    className="flex items-center justify-center w-10 h-10 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full transition-colors"
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause size={16} />
                    ) : (
                      <Play size={16} />
                    )}
                  </button>
                )}

                {/* Price and Buy Button */}
                <div className="text-right">
                  <p className="text-green-200 font-mono font-bold text-lg">{formatPrice(track.price_cents)}</p>
                  <button
                    onClick={() => handleBuyTrack(track)}
                    disabled={isProcessing || !track.stripe_price_id}
                    className={`flex items-center gap-1 font-bold px-3 py-1 rounded text-sm transition-colors ${
                      !track.stripe_price_id 
                        ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        : isProcessing
                        ? 'bg-gray-500 cursor-not-allowed text-white'
                        : 'bg-yellow-500 hover:bg-yellow-600 text-black'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border border-black border-t-transparent"></div>
                        Processing...
                      </>
                    ) : !track.stripe_price_id ? (
                      <>
                        <AlertTriangle size={14} />
                        Unavailable
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={14} />
                        Buy Now
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Player for Current Track */}
            {currentTrack?.id === track.id && track.audio_preview && (
              <div className="mt-4 pt-4 border-t border-green-500/20">
                <audio
                  src={track.audio_preview}
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
        ))}
      </div>
    </div>
  );
}