import { ShoppingCart } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout';
import { Product } from '../stripe-config';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-amber-500/50 transition-all duration-300">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-amber-500 mb-2">{product.name}</h3>
        <p className="text-gray-300 text-sm leading-relaxed">{product.description}</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-green-200">
          <span className="text-2xl font-bold">$0.99</span>
          <span className="text-sm text-gray-400 ml-1">
            {product.mode === 'subscription' ? '/month' : 'one-time'}
          </span>
        </div>
        
        <StripeCheckout productId={product.id}>
          <ShoppingCart size={16} />
          {product.mode === 'subscription' ? 'Subscribe' : 'Buy Now'}
        </StripeCheckout>
      </div>
    </div>
  );
}