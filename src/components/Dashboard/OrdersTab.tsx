import { ShoppingBag, Music, Calendar, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

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

interface OrdersTabProps {
  purchases: Purchase[];
  formatCurrency: (cents: number) => string;
  formatDate: (dateString: string) => string;
  onDownload: (trackId: string, trackTitle: string) => void;
}

export function OrdersTab({ purchases, formatCurrency, formatDate, onDownload }: OrdersTabProps) {
  if (purchases.length === 0) {
    return (
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-8">
        <div className="text-center py-8">
          <ShoppingBag size={64} className="text-gray-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-amber-500 mb-2">No Orders Yet</h3>
          <p className="text-gray-400 mb-6">
            You haven't made any purchases yet. Browse our music collection to get started!
          </p>
          <Link
            to="/music"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            <Music size={20} />
            Start Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-amber-500">Order History</h3>
          <span className="text-sm text-gray-400">
            {purchases.length} order{purchases.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div key={purchase.id} className="border border-green-500/20 rounded-lg p-4 hover:border-amber-500/30 transition-colors">
              <div className="flex items-center gap-4">
                {/* Cover Image */}
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
                
                {/* Order Details */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-amber-500 font-bold">
                    {purchase.music_tracks.title}
                  </h4>
                  <p className="text-green-200/80">{purchase.music_tracks.artist}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>{formatDate(purchase.purchased_at)}</span>
                    </div>
                    <span>Order #{purchase.id.slice(0, 8)}</span>
                    <span className="capitalize bg-green-900/20 text-green-300 px-2 py-1 rounded text-xs">
                      {purchase.status}
                    </span>
                  </div>
                </div>

                {/* Price and Actions */}
                <div className="text-right">
                  <p className="text-green-300 font-bold text-lg mb-2">
                    {formatCurrency(purchase.amount_cents)}
                  </p>
                  <button
                    onClick={() => onDownload(purchase.track_id, purchase.music_tracks.title)}
                    className="flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-black font-medium px-3 py-1 rounded text-sm transition-colors"
                  >
                    <Download size={14} />
                    Download
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