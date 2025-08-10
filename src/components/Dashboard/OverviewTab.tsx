import { Music, ShoppingBag, DollarSign, Calendar, TrendingUp, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  music_tracks: {
    id: string;
    title: string;
    artist: string;
    cover_image_url: string | null;
    cover_url: string | null;
  };
}

interface OverviewTabProps {
  stats: DashboardStats;
  recentPurchases: Purchase[];
  formatCurrency: (cents: number) => string;
  formatDate: (dateString: string) => string;
}

export function OverviewTab({ stats, recentPurchases, formatCurrency, formatDate }: OverviewTabProps) {
  const statsCards = [
    {
      title: 'Total Orders',
      value: stats.totalPurchases.toString(),
      icon: ShoppingBag,
      color: 'text-amber-500',
      bgColor: 'bg-amber-500/10'
    },
    {
      title: 'Total Spent',
      value: formatCurrency(stats.totalSpent),
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Tracks Owned',
      value: stats.tracksOwned.toString(),
      icon: Music,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Last Purchase',
      value: stats.lastPurchase ? formatDate(stats.lastPurchase) : 'None yet',
      icon: Calendar,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <div key={index} className={`bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 ${stat.bgColor}`}>
            <div className="flex items-center gap-3 mb-2">
              <stat.icon size={20} className={stat.color} />
              <span className="text-sm text-gray-400">{stat.title}</span>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-500">Recent Activity</h3>
          {recentPurchases.length > 0 && (
            <Link
              to="/dashboard?tab=orders"
              className="text-sm text-green-300 hover:text-green-200 transition-colors"
            >
              View All
            </Link>
          )}
        </div>

        {recentPurchases.length === 0 ? (
          <div className="text-center py-8">
            <Music size={48} className="text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 mb-4">No purchases yet</p>
            <Link
              to="/music"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
            >
              <Music size={16} />
              Browse Music
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentPurchases.slice(0, 5).map((purchase) => (
              <div key={purchase.id} className="flex items-center gap-4 p-3 bg-black/40 rounded-lg hover:bg-black/60 transition-colors">
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

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-amber-500 mb-3">Discover New Music</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Check out the latest Kingdom music releases and support the ministry.
          </p>
          <Link
            to="/music"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Play size={16} />
            Browse Music
          </Link>
        </div>

        <div className="bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/30 rounded-lg p-6">
          <h3 className="text-lg font-bold text-green-500 mb-3">Your Music Library</h3>
          <p className="text-gray-300 mb-4 text-sm">
            Access and download your purchased music collection.
          </p>
          <Link
            to="/dashboard?tab=library"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-lg transition-colors"
          >
            <Music size={16} />
            View Library
          </Link>
        </div>
      </div>
    </div>
  );
}