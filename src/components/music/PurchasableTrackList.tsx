import { useState } from 'react';
import { ShoppingCart, User, Music } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { Track } from '../../types/music';
import { supabase } from '../../lib/supabase';
import { SignupModal } from '../auth/SignupModal';

interface PurchasableTrackListProps {
  tracks: Track[];
  user: SupabaseUser | null;
  artist: string;
}

export function PurchasableTrackList({ tracks, user, artist }: PurchasableTrackListProps) {
  const [processingTrack, setProcessingTrack] = useState<string | null>(null);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const handleBuyTrack = async (track: Track) => {
    // Check if user is authenticated
    if (!user) {
      setShowSignupModal(true);
      return;
    }

    // Check if track has a Stripe Price ID
    if (!track.stripe_price_id) {
      alert('This track is not available for purchase yet. Please check back soon!');
      return;
    }

    setProcessingTrack(track.id);
    
    try {
      console.log('Initiating checkout for track:', track.title, 'with Price ID:', track.stripe_price_id);
      
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setShowSignupModal(true);
        return;
      }
      
      const origin = window.location.origin;
      const successUrl = `${origin}/library?success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/music?canceled=true`;

      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: track.stripe_price_id,
          success_url: successUrl,
          cancel_url: cancelUrl,
          mode: 'payment',
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
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

  if (!tracks.length) {
    return (
      <div className="text-center py-8">
        <Music size={48} className="text-gray-500 mx-auto mb-4" />
        <p className="text-gray-400">No tracks available for {artist} yet.</p>
        <p className="text-gray-500 text-sm mt-2">Check back soon for new releases!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid gap-4">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-amber-500/50 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              {/* Cover Image */}
              <div className="w-16 h-16 bg-gray-800 rounded overflow-hidden flex-shrink-0">
                {track.cover_image_url || track.cover_url ? (
                  <img
                    src={track.cover_image_url || track.cover_url}
                    alt={`${track.title} cover`}
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
                <h4 className="text-xl font-bold text-amber-500 mb-1">{track.title}</h4>
                <p className="text-green-200/80">{track.artist}</p>
                {track.description && (
                  <p className="text-green-200/60 text-sm mt-2 line-clamp-2">{track.description}</p>
                )}
              </div>

              {/* Price and Buy Button */}
              <div className="text-right flex-shrink-0">
                <p className="text-green-200 font-mono font-bold text-xl mb-2">
                  {formatPrice(track.price_cents)}
                </p>
                <button
                  onClick={() => handleBuyTrack(track)}
                  disabled={processingTrack === track.id || !track.stripe_price_id}
                  className={`flex items-center gap-2 font-bold px-4 py-2 rounded-lg text-sm transition-colors ${
                    processingTrack === track.id
                      ? 'bg-gray-500 cursor-not-allowed text-white'
                      : !track.stripe_price_id 
                      ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                      : user
                      ? 'bg-amber-500 hover:bg-amber-600 text-black'
                      : 'bg-blue-500 hover:bg-blue-600 text-white'
                  }`}
                >
                  {processingTrack === track.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border border-black border-t-transparent"></div>
                      Processing...
                    </>
                  ) : !track.stripe_price_id ? (
                    'Coming Soon'
                  ) : !user ? (
                    <>
                      <User size={16} />
                      Sign Up & Buy
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
          </div>
        ))}
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
</invoke>