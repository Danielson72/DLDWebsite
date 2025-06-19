import { useState } from 'react';
import { ShoppingCart, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { products, Product } from '../stripe-config';

interface StripeCheckoutProps {
  productId: string;
  className?: string;
  children?: React.ReactNode;
}

export function StripeCheckout({ productId, className = '', children }: StripeCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false);

  const product = products.find(p => p.id === productId);

  if (!product) {
    console.error(`Product with ID ${productId} not found`);
    return null;
  }

  const handleCheckout = async () => {
    try {
      setIsLoading(true);

      // Get the current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('Please sign in to make a purchase');
      }

      const origin = window.location.origin;
      const successUrl = `${origin}/library?success=true&session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${origin}/music?canceled=true`;

      // Call the Stripe checkout edge function
      const { data, error } = await supabase.functions.invoke('stripe-checkout', {
        body: {
          price_id: product.priceId,
          success_url: successUrl,
          cancel_url: cancelUrl,
          mode: product.mode,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) {
        throw error;
      }

      if (data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL received');
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      alert(`Checkout failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleCheckout}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold px-4 py-2 rounded-lg transition-colors ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          Processing...
        </>
      ) : children ? (
        children
      ) : (
        <>
          <ShoppingCart size={16} />
          Buy Now - $0.99
        </>
      )}
    </button>
  );
}