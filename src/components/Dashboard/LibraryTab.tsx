import { Music, Download, Calendar, Play, Pause } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

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

interface LibraryTabProps {
  purchases: Purchase[];
  formatCurrency: (cents: number) => string;
  formatDate: (dateString: string) => string;
  onDownload: (trackId: string, trackTitle: string) => void;
}

export function LibraryTab({ purchases, formatCurrency, formatDate, onDownload }: LibraryTabProps) {
  const [downloadingTrack, setDownloadingTrack] = useState<string | null>(null);

  const handleDownload = async (trackId: string, trackTitle: string) => {
    setDownloadingTrack(trackId);
    try {
      const { data, error } = await supabase.functions.invoke('getSignedUrl', { body: { track_id: trackId } })
      if (error) { 
        alert(error.message)
        return
      }
      window.location.href = (data as any).url
    } finally {
      setDownloadingTrack(null);
    }
  };

  if (purchases.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-8">
        <div className="text-center py-8">
          <Music size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-500 mb-2">Your Library is Empty</h3>
          <p className="text-gray-400 mb-6">
            Start building your collection by purchasing Kingdom music tracks.
          </p>
          <Link
            to="/music"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            <Music size={20} />
            Browse Music
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-amber-500">My Music Collection</h3>
          <span className="text-sm text-gray-400">
            {purchases.length} track{purchases.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid gap-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="flex items-center gap-4 p-4 border border-green-500/20 rounded-lg hover:border-amber-500/30 transition-colors">
              {/* Cover Art */}
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

              {/* Track Info */}
              <div className="flex-1 min-w-0">
                <h4 className="text-amber-500 font-bold text-lg">
                  {purchase.music_tracks.title}
                </h4>
                <p className="text-green-200/80">{purchase.music_tracks.artist}</p>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar size={12} />
                    <span>Purchased {formatDate(purchase.purchased_at)}</span>
                  </div>
                  <span className="text-green-300 font-medium">
                    {formatCurrency(purchase.amount_cents)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
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
          ))}
        </div>
      </div>

      {/* Library Actions */}
      <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-lg p-6 text-center">
        <h3 className="text-lg font-bold text-amber-500 mb-3">Expand Your Collection</h3>
        <p className="text-gray-300 mb-4">
          Discover more Kingdom music and support the ministry with your purchases.
        </p>
        <Link
          to="/music"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
        >
          <Music size={20} />
          Browse All Music
        </Link>
      </div>
    </div>
  );
}