import { Play, Pause, ShoppingCart } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { Track } from '../../types/music';
import { supabase } from '../../lib/supabase';
import { DeleteTrack } from './DeleteTrack';

interface PlayerContentProps {
  tracks: Track[];
  onTrackDeleted?: () => void;
}

export function PlayerContent({ tracks, onTrackDeleted }: PlayerContentProps) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (tracks.length > 0 && !currentTrack) {
      setCurrentTrack(tracks[0]);
    }
  }, [tracks, currentTrack]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTrackSelect = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
  };

  const handleBuyTrack = async (trackId: string) => {
    setIsProcessing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { trackId }
      });

      if (error) {
        console.error('Error creating checkout session:', error);
        alert('Error processing payment. Please try again.');
        return;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Error creating checkout session. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error processing payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  if (!tracks.length) {
    return (
      <div className="text-center py-12">
        <p className="text-yellow-200 text-lg">No tracks available for this artist yet.</p>
        <p className="text-yellow-200/60 text-sm mt-2">Check back soon for new releases!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Now Playing Section */}
      {currentTrack && (
        <div className="bg-black/40 p-6 rounded-lg border border-yellow-400/30">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-yellow-300">Now Playing</h2>
            <DeleteTrack track={currentTrack} onDeleted={onTrackDeleted} />
          </div>
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={togglePlayPause}
              className="flex items-center justify-center w-12 h-12 bg-yellow-500 hover:bg-yellow-600 text-black rounded-full transition-colors"
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-yellow-300">{currentTrack.title}</h3>
              <p className="text-green-200">{currentTrack.artist}</p>
            </div>
            <div className="text-right">
              <p className="text-yellow-300 font-bold text-lg">{formatPrice(currentTrack.price_cents)}</p>
              <button
                onClick={() => handleBuyTrack(currentTrack.id)}
                disabled={isProcessing}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-lg transition-colors"
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={16} />
                    Buy Now
                  </>
                )}
              </button>
            </div>
          </div>
          
          {currentTrack.audio_preview && (
            <audio
              ref={audioRef}
              src={currentTrack.audio_preview}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              className="w-full accent-yellow-400"
              controls
            />
          )}
          
          {currentTrack.description && (
            <p className="text-green-200/80 mt-4">{currentTrack.description}</p>
          )}
        </div>
      )}

      {/* Track List */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-yellow-300">All Tracks</h3>
        <div className="grid gap-4">
          {tracks.map((track) => (
            <div
              key={track.id}
              className={`bg-black/40 p-4 rounded-lg border transition-all cursor-pointer hover:bg-black/60 ${
                currentTrack?.id === track.id
                  ? 'border-yellow-400/50 bg-yellow-400/10'
                  : 'border-green-500/30'
              }`}
              onClick={() => handleTrackSelect(track)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-yellow-300 font-semibold">{track.title}</h4>
                    <DeleteTrack track={track} onDeleted={onTrackDeleted} />
                  </div>
                  <p className="text-green-200/80 text-sm">{track.artist}</p>
                  {track.description && (
                    <p className="text-green-200/60 text-sm mt-1 line-clamp-2">{track.description}</p>
                  )}
                </div>
                <div className="text-right ml-4">
                  <p className="text-green-200 font-mono font-bold">{formatPrice(track.price_cents)}</p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBuyTrack(track.id);
                    }}
                    disabled={isProcessing}
                    className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-black font-bold px-3 py-1 rounded text-sm transition-colors mt-1"
                  >
                    {isProcessing ? 'Processing...' : 'Buy'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}