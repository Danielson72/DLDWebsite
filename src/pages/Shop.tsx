import { ShoppingBag } from 'lucide-react';
import { PageHero } from '../components/PageHero';
import { ProductCard } from '../components/ProductCard';
import { SubscriptionStatus } from '../components/SubscriptionStatus';
import { AuthWrapper } from '../components/music/AuthWrapper';
import { products } from '../stripe-config';

export function Shop() {
  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Music Shop" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          <AuthWrapper>
            {(user) => (
              <div>
                {/* Header */}
                <div className="text-center mb-12">
                  <div className="flex justify-center mb-6">
                    <ShoppingBag size={48} className="text-amber-500" />
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
                    Premium Music Downloads
                  </h2>
                  <p className="text-xl text-emerald-400 max-w-3xl mx-auto leading-relaxed">
                    Support the ministry by purchasing high-quality Gospel Hip Hop tracks. 
                    Each purchase helps fund our community outreach and spiritual mission.
                  </p>
                </div>

                {/* Subscription Status for authenticated users */}
                {user && (
                  <div className="mb-8">
                    <h3 className="text-lg font-bold text-amber-500 mb-4">Your Account Status</h3>
                    <SubscriptionStatus />
                  </div>
                )}

                {/* Products Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>

                {/* Features */}
                <div className="bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-xl p-8">
                  <h3 className="text-2xl font-bold text-amber-500 mb-6 text-center">
                    What You Get
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-3xl mb-3">🎵</div>
                      <h4 className="text-lg font-bold text-amber-500 mb-2">High Quality Audio</h4>
                      <p className="text-gray-300 text-sm">
                        Premium 320kbps MP3 files for the best listening experience
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-3">⬇️</div>
                      <h4 className="text-lg font-bold text-amber-500 mb-2">Instant Download</h4>
                      <p className="text-gray-300 text-sm">
                        Immediate access to your music after purchase
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl mb-3">🔒</div>
                      <h4 className="text-lg font-bold text-amber-500 mb-2">Secure Payment</h4>
                      <p className="text-gray-300 text-sm">
                        Safe and secure transactions powered by Stripe
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AuthWrapper>
        </div>
      </div>
    </div>
  );
}