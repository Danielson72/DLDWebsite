import { useState } from 'react';
import { X, LogIn, UserPlus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { RegistrationForm } from './RegistrationForm';

interface SignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function SignupModal({ isOpen, onClose, onSuccess }: SignupModalProps) {
  const [showFullRegistration, setShowFullRegistration] = useState(false);
  const [isSignUp, setIsSignUp] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleQuickAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          alert('Please check your email to confirm your account!');
        } else {
          onSuccess();
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: form.email,
          password: form.password,
        });

        if (error) throw error;
        onSuccess();
      }

      onClose();
      setForm({ email: '', password: '' });
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {showFullRegistration ? (
        <RegistrationForm
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
          onCancel={() => setShowFullRegistration(false)}
          isModal={true}
        />
      ) : (
        <div className="bg-black/90 border border-green-500/30 rounded-xl w-full max-w-md">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                {isSignUp ? <UserPlus size={24} className="text-amber-500" /> : <LogIn size={24} className="text-amber-500" />}
                <h2 className="text-xl font-bold text-amber-500">
                  {isSignUp ? 'Quick Sign Up' : 'Sign In'}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Quick Auth Form */}
            <form onSubmit={handleQuickAuth} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full p-3 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-amber-500 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                  placeholder="Your password"
                  required
                  minLength={6}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 rounded transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                ) : (
                  <>
                    {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                    {isSignUp ? 'Quick Sign Up' : 'Sign In'}
                  </>
                )}
              </button>
            </form>

            {/* Advanced Registration Option */}
            {isSignUp && (
              <div className="mt-4">
                <button
                  onClick={() => setShowFullRegistration(true)}
                  className="w-full bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-medium py-2 rounded transition-colors"
                >
                  Complete Registration Form
                </button>
              </div>
            )}

            {/* Toggle between sign up and sign in */}
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-green-300 hover:text-green-200 text-sm"
              >
                {isSignUp 
                  ? 'Already have an account? Sign in' 
                  : "Don't have an account? Sign up"
                }
              </button>
            </div>

            {/* Benefits */}
            {isSignUp && (
              <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-200">
                <p className="font-medium mb-1">Why create an account?</p>
                <ul className="space-y-1 text-green-300/80">
                  <li>• Instant access to purchased music</li>
                  <li>• Track your music library</li>
                  <li>• Re-download tracks anytime</li>
                  <li>• Get notified of new releases</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}