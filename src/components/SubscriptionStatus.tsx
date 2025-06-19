import { useState, useEffect } from 'react';
import { Crown, Calendar, CreditCard, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SubscriptionData {
  subscription_status: string;
  price_id: string | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean;
  payment_method_brand: string | null;
  payment_method_last4: string | null;
}

export function SubscriptionStatus() {
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('stripe_user_subscriptions')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }

      setSubscription(data);
    } catch (err: any) {
      console.error('Error fetching subscription:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-4">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-8 h-8 bg-gray-600 rounded-full"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-600 rounded w-1/3 mb-2"></div>
            <div className="h-3 bg-gray-600 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <AlertCircle size={20} className="text-red-400" />
          <span className="text-red-300">Failed to load subscription status</span>
        </div>
      </div>
    );
  }

  if (!subscription || subscription.subscription_status === 'not_started') {
    return (
      <div className="bg-gray-900/20 border border-gray-500/30 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <Crown size={20} className="text-gray-400" />
          <div>
            <p className="text-gray-300 font-medium">No Active Subscription</p>
            <p className="text-gray-400 text-sm">Upgrade to access premium features</p>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-400 border-green-500/30 bg-green-900/20';
      case 'trialing':
        return 'text-blue-400 border-blue-500/30 bg-blue-900/20';
      case 'past_due':
      case 'unpaid':
        return 'text-red-400 border-red-500/30 bg-red-900/20';
      case 'canceled':
        return 'text-gray-400 border-gray-500/30 bg-gray-900/20';
      default:
        return 'text-amber-400 border-amber-500/30 bg-amber-900/20';
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'Active Subscription';
      case 'trialing':
        return 'Trial Period';
      case 'past_due':
        return 'Payment Past Due';
      case 'unpaid':
        return 'Payment Required';
      case 'canceled':
        return 'Canceled';
      case 'incomplete':
        return 'Setup Incomplete';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className={`border rounded-lg p-4 ${getStatusColor(subscription.subscription_status)}`}>
      <div className="flex items-start gap-3">
        <Crown size={20} className="mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="font-medium">{getStatusText(subscription.subscription_status)}</p>
            {subscription.cancel_at_period_end && (
              <span className="text-xs bg-red-500/20 text-red-300 px-2 py-1 rounded">
                Canceling
              </span>
            )}
          </div>
          
          <div className="space-y-1 text-sm opacity-80">
            {subscription.current_period_end && (
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {subscription.cancel_at_period_end ? 'Ends' : 'Renews'} on{' '}
                  {formatDate(subscription.current_period_end)}
                </span>
              </div>
            )}
            
            {subscription.payment_method_brand && subscription.payment_method_last4 && (
              <div className="flex items-center gap-2">
                <CreditCard size={14} />
                <span>
                  {subscription.payment_method_brand.toUpperCase()} ****{subscription.payment_method_last4}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}