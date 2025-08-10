import { useState } from 'react';
import { X, LogIn, UserPlus, Eye, EyeOff, User, Mail, Lock, Phone, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AuthModalV2Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface AuthForm {
  email: string;
  password: string;
  name: string;
  phone: string;
}

export function AuthModalV2({ isOpen, onClose, onSuccess }: AuthModalV2Props) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  
  const [form, setForm] = useState<AuthForm>({
    email: '',
    password: '',
    name: '',
    phone: '',
  });

  const resetForm = () => {
    setForm({
      email: '',
      password: '',
      name: '',
      phone: '',
    });
    setMessage(null);
    setShowPassword(false);
  };

  const handleClose = () => {
    resetForm();
    setIsSignUp(false);
    onClose();
  };

  const handleInputChange = (field: keyof AuthForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const ensureUserProfile = async (user: any) => {
    try {
      // Check if profile exists
      const { data: existingProfile } = await supabase
        .from('user_profiles')
        .select('id')
        .eq('user_id', user.id)
        .single();

      if (!existingProfile) {
        // Create profile if it doesn't exist
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: user.id,
            email: user.email,
            display_name: form.name.trim() || user.email?.split('@')[0] || 'User',
            phone: form.phone.trim() || null,
          });

        if (profileError) {
          console.error('Error creating user profile:', profileError);
        }
      }
    } catch (error) {
      console.error('Error ensuring user profile:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (isSignUp) {
        // Sign up
        const { data, error } = await supabase.auth.signUp({
          email: form.email,
          password: form.password,
          options: {
            emailRedirectTo: `${import.meta.env.VITE_SITE_URL}/auth/callback`,
            data: {
              name: form.name.trim(),
              phone: form.phone.trim(),
            },
          },
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
          return;
        }

        if (data.user) {
          await ensureUserProfile(data.user);
          
          if (data.user.email_confirmed_at) {
            setMessage({ type: 'success', text: 'Account created successfully!' });
            setTimeout(() => {
              onSuccess();
              handleClose();
            }, 1000);
          } else {
            setMessage({ type: 'success', text: 'Please check your email to confirm your account!' });
          }
        }
      } else {
        // Sign in
        const { data, error } = await supabase.auth.signInWithPassword({
          email: form.email.trim(),
          password: form.password.trim(),
        });

        if (error) {
          setMessage({ type: 'error', text: error.message });
          return;
        }

        if (data.user) {
          await ensureUserProfile(data.user);
          setMessage({ type: 'success', text: 'Successfully signed in!' });
          setTimeout(() => {
            onSuccess();
            handleClose();
          }, 1000);
        }
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/95 backdrop-blur-sm border border-green-500/30 rounded-xl max-w-md w-full">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              {isSignUp ? <UserPlus size={24} className="text-amber-500" /> : <LogIn size={24} className="text-amber-500" />}
              <h2 className="text-xl font-bold text-amber-500">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mb-4 p-3 rounded-lg border flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-900/20 border-green-500/30 text-green-300' 
                : 'bg-red-900/20 border-red-500/30 text-red-300'
            }`}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              <span className="text-sm">{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  <User size={14} className="inline mr-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                  placeholder="Your full name"
                  required={isSignUp}
                />
              </div>
            )}

            {/* Phone (Sign Up Only) */}
            {isSignUp && (
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  <Phone size={14} className="inline mr-2" />
                  Phone Number (Optional)
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                  placeholder="(555) 123-4567"
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                <Mail size={14} className="inline mr-2" />
                Email Address *
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                placeholder="your@email.com"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                <Lock size={14} className="inline mr-2" />
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full p-3 pr-12 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                  placeholder="Your password"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isSignUp && (
                <p className="mt-1 text-xs text-gray-400">
                  Minimum 6 characters
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  {isSignUp ? 'Creating Account...' : 'Signing In...'}
                </>
              ) : (
                <>
                  {isSignUp ? <UserPlus size={20} /> : <LogIn size={20} />}
                  {isSignUp ? 'Create Account' : 'Sign In'}
                </>
              )}
            </button>
          </form>

          {/* Toggle between sign up and sign in */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                resetForm();
              }}
              className="text-green-300 hover:text-green-200 text-sm"
            >
              {isSignUp 
                ? 'Already have an account? Sign in' 
                : "Don't have an account? Sign up"
              }
            </button>
          </div>

          {/* Benefits for Sign Up */}
          {isSignUp && (
            <div className="mt-4 p-3 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-200">
              <p className="font-medium mb-1">Join the Lion's Den Community:</p>
              <ul className="space-y-1 text-green-300/80">
                <li>• Access your personal dashboard</li>
                <li>• Track your music purchases</li>
                <li>• Download your library anytime</li>
                <li>• Get updates on new releases</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}