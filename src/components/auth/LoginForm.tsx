import { useState } from 'react';
import { Eye, EyeOff, LogIn, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface LoginFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

export function LoginForm({ onSuccess, onCancel, isModal = false }: LoginFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        return;
      }

      setMessage({ type: 'success', text: 'Successfully signed in!' });
      
      setTimeout(() => {
        onSuccess?.();
      }, 1000);

    } catch (error: any) {
      setMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClass = isModal 
    ? "bg-black/95 backdrop-blur-sm border border-green-500/30 rounded-xl max-w-md w-full mx-4"
    : "bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-xl max-w-md mx-auto";

  return (
    <div className={containerClass}>
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <LogIn size={24} className="sm:size-8 text-amber-500" />
            </div>
          </div>
          <h1 className="responsive-heading-lg font-bold text-amber-500 mb-2">Welcome Back</h1>
          <p className="text-gray-300 text-sm sm:text-base">Sign in to your Lion's Den account</p>
        </div>

        {/* Message */}
        {message && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-center gap-3 ${
            message.type === 'success' 
              ? 'bg-green-900/20 border-green-500/30 text-green-300' 
              : 'bg-red-900/20 border-red-500/30 text-red-300'
          }`}>
            {message.type === 'success' ? <CheckCircle size={16} className="sm:size-5" /> : <AlertCircle size={16} className="sm:size-5" />}
            <span className="text-sm sm:text-base">{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              <Mail size={14} className="sm:size-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="w-full p-2.5 sm:p-3 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors text-sm sm:text-base"
              placeholder="your@email.com"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              <Lock size={14} className="sm:size-4 inline mr-2" />
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full p-2.5 sm:p-3 pr-10 sm:pr-12 bg-black/60 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 transition-colors text-sm sm:text-base"
                placeholder="Your password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} className="sm:size-5" /> : <Eye size={16} className="sm:size-5" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                  <span className="hidden sm:inline">Signing In...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <LogIn size={16} className="sm:size-5" />
                  Sign In
                </>
              )}
            </button>
          </div>

          {/* Cancel Button for Modal */}
          {isModal && onCancel && (
            <div className="text-center">
              <button
                type="button"
                onClick={onCancel}
                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          )}
        </form>

        {/* Forgot Password */}
        <div className="mt-4 sm:mt-6 text-center">
          <button
            type="button"
            className="text-green-300 hover:text-green-200 text-xs sm:text-sm"
          >
            Forgot your password?
          </button>
        </div>
      </div>
    </div>
  );
}