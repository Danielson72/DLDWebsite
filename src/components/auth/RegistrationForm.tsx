import { useState, useEffect } from 'react';
import { Eye, EyeOff, CheckCircle, XCircle, User, Mail, Lock, Calendar, Shield, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface RegistrationFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
  isModal?: boolean;
}

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  termsAccepted: boolean;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  termsAccepted?: string;
}

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: 'At least 8 characters', test: (p) => p.length >= 8 },
  { label: 'Contains uppercase letter', test: (p) => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: (p) => /[a-z]/.test(p) },
  { label: 'Contains number', test: (p) => /\d/.test(p) },
  { label: 'Contains special character', test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export function RegistrationForm({ onSuccess, onCancel, isModal = false }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    termsAccepted: false,
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Real-time validation
  useEffect(() => {
    validateForm();
  }, [formData]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateAge = (dateOfBirth: string): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      return age - 1 >= 13;
    }
    return age >= 13;
  };

  const validateForm = () => {
    const newErrors: ValidationErrors = {};

    // First Name
    if (touched.firstName && !formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (touched.firstName && formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last Name
    if (touched.lastName && !formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (touched.lastName && formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Username
    if (touched.username && !formData.username) {
      newErrors.username = 'Username is required';
    } else if (touched.username && !validateUsername(formData.username)) {
      newErrors.username = 'Username must be 3-20 characters (letters, numbers, underscore only)';
    }

    // Email
    if (touched.email && !formData.email) {
      newErrors.email = 'Email is required';
    } else if (touched.email && !validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password
    if (touched.password && !formData.password) {
      newErrors.password = 'Password is required';
    } else if (touched.password) {
      const failedRequirements = passwordRequirements.filter(req => !req.test(formData.password));
      if (failedRequirements.length > 0) {
        newErrors.password = 'Password does not meet all requirements';
      }
    }

    // Confirm Password
    if (touched.confirmPassword && !formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (touched.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Date of Birth
    if (touched.dateOfBirth && formData.dateOfBirth && !validateAge(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'You must be at least 13 years old';
    }

    // Terms
    if (touched.termsAccepted && !formData.termsAccepted) {
      newErrors.termsAccepted = 'You must accept the terms and conditions';
    }

    setErrors(newErrors);
  };

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    setSubmitMessage(null);
  };

  const handleBlur = (field: keyof FormData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const isFormValid = () => {
    const allFieldsTouched = Object.keys(formData).every(field => touched[field]);
    const noErrors = Object.keys(errors).length === 0;
    const allRequiredFields = formData.firstName && formData.lastName && formData.username && 
                             formData.email && formData.password && formData.confirmPassword && 
                             formData.termsAccepted;
    
    return allFieldsTouched && noErrors && allRequiredFields;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allFields = Object.keys(formData) as (keyof FormData)[];
    setTouched(Object.fromEntries(allFields.map(field => [field, true])));

    if (!isFormValid()) {
      setSubmitMessage({ type: 'error', text: 'Please correct all errors before submitting' });
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName.trim(),
            last_name: formData.lastName.trim(),
            username: formData.username.trim(),
            display_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
            date_of_birth: formData.dateOfBirth,
          },
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          setSubmitMessage({ type: 'error', text: 'An account with this email already exists' });
        } else {
          setSubmitMessage({ type: 'error', text: error.message });
        }
        return;
      }

      if (data.user && !data.user.email_confirmed_at) {
        setSubmitMessage({ 
          type: 'success', 
          text: 'Account created successfully! Please check your email to confirm your account.' 
        });
      } else {
        setSubmitMessage({ type: 'success', text: 'Account created successfully!' });
      }

      setTimeout(() => {
        onSuccess?.();
      }, 2000);

    } catch (error: any) {
      setSubmitMessage({ type: 'error', text: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const containerClass = isModal 
    ? "bg-black/95 backdrop-blur-sm border border-green-500/30 rounded-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
    : "bg-black/90 backdrop-blur-sm border border-green-500/30 rounded-xl max-w-2xl mx-auto";

  return (
    <div className={containerClass}>
      <div className="p-6 sm:p-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-amber-500/20 rounded-full">
              <Shield size={24} className="sm:size-8 text-amber-500" />
            </div>
          </div>
          <h1 className="responsive-heading-lg font-bold text-amber-500 mb-2">Create Your Account</h1>
          <p className="text-gray-300 text-sm sm:text-base">Join the Lion's Den community and access exclusive music content</p>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-lg border flex items-center gap-3 ${
            submitMessage.type === 'success' 
              ? 'bg-green-900/20 border-green-500/30 text-green-300' 
              : 'bg-red-900/20 border-red-500/30 text-red-300'
          }`}>
            {submitMessage.type === 'success' ? <CheckCircle size={16} className="sm:size-5" /> : <AlertCircle size={16} className="sm:size-5" />}
            <span className="text-sm sm:text-base">{submitMessage.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                <User size={14} className="sm:size-4 inline mr-2" />
                First Name *
              </label>
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                onBlur={() => handleBlur('firstName')}
                className={`w-full p-2.5 sm:p-3 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                  errors.firstName ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
                }`}
                placeholder="John"
                maxLength={50}
              />
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <XCircle size={12} className="sm:size-4" />
                  {errors.firstName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Last Name *
              </label>
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                onBlur={() => handleBlur('lastName')}
                className={`w-full p-2.5 sm:p-3 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                  errors.lastName ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
                }`}
                placeholder="Doe"
                maxLength={50}
              />
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                  <XCircle size={12} className="sm:size-4" />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              Username *
            </label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
              onBlur={() => handleBlur('username')}
              className={`w-full p-2.5 sm:p-3 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                errors.username ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
              }`}
              placeholder="johndoe_123"
              maxLength={20}
            />
            <p className="mt-1 text-xs text-gray-400">
              3-20 characters, letters, numbers and underscore only
            </p>
            {errors.username && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.username}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              <Mail size={14} className="sm:size-4 inline mr-2" />
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value.toLowerCase())}
              onBlur={() => handleBlur('email')}
              className={`w-full p-2.5 sm:p-3 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.email}
              </p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              <Calendar size={14} className="sm:size-4 inline mr-2" />
              Date of Birth (Optional)
            </label>
            <input
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
              onBlur={() => handleBlur('dateOfBirth')}
              max={new Date(Date.now() - 13 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
              className={`w-full p-2.5 sm:p-3 bg-black/60 border rounded-lg text-white focus:outline-none transition-colors text-sm sm:text-base ${
                errors.dateOfBirth ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
              }`}
            />
            <p className="mt-1 text-xs text-gray-400">
              If provided, you must be at least 13 years old
            </p>
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.dateOfBirth}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              <Lock size={14} className="sm:size-4 inline mr-2" />
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                onBlur={() => handleBlur('password')}
                className={`w-full p-2.5 sm:p-3 pr-10 sm:pr-12 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                  errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
                }`}
                placeholder="Create a strong password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={16} className="sm:size-5" /> : <Eye size={16} className="sm:size-5" />}
              </button>
            </div>

            {/* Password Requirements */}
            {formData.password && (
              <div className="mt-3 p-3 bg-black/40 border border-green-500/20 rounded-lg">
                <p className="text-sm font-medium text-amber-500 mb-2">Password Requirements:</p>
                <div className="space-y-1">
                  {passwordRequirements.map((req, index) => {
                    const isMet = req.test(formData.password);
                    return (
                      <div key={index} className={`text-xs flex items-center gap-2 ${
                        isMet ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {isMet ? <CheckCircle size={12} className="sm:size-4" /> : <XCircle size={12} className="sm:size-4" />}
                        {req.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-amber-500 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full p-2.5 sm:p-3 pr-10 sm:pr-12 bg-black/60 border rounded-lg text-white placeholder-gray-400 focus:outline-none transition-colors text-sm sm:text-base ${
                  errors.confirmPassword ? 'border-red-500/50 focus:border-red-500' : 'border-green-500/30 focus:border-amber-500'
                }`}
                placeholder="Confirm your password"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} className="sm:size-5" /> : <Eye size={16} className="sm:size-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.password === formData.confirmPassword && (
              <p className="mt-1 text-sm text-green-400 flex items-center gap-1">
                <CheckCircle size={12} className="sm:size-4" />
                Passwords match
              </p>
            )}
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {/* Terms and Conditions */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.termsAccepted}
                onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                onBlur={() => handleBlur('termsAccepted')}
                className="mt-1 w-4 h-4 text-amber-500 bg-black/60 border-green-500/30 rounded focus:ring-amber-500 focus:ring-2"
              />
              <span className="text-sm text-gray-300">
                I agree to the{' '}
                <a href="/terms" target="_blank" className="text-amber-500 hover:text-amber-400 underline">
                  Terms and Conditions
                </a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" className="text-amber-500 hover:text-amber-400 underline">
                  Privacy Policy
                </a>{' '}
                *
              </span>
            </label>
            {errors.termsAccepted && (
              <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
                <XCircle size={12} className="sm:size-4" />
                {errors.termsAccepted}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2 sm:pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-black"></div>
                  <span className="hidden sm:inline">Creating Account...</span>
                  <span className="sm:hidden">...</span>
                </>
              ) : (
                <>
                  <Shield size={16} className="sm:size-5" />
                  Create Account
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

        {/* Security Notice */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield size={14} className="sm:size-4 text-green-400" />
            <span className="text-sm font-medium text-green-400">Security & Privacy</span>
          </div>
          <ul className="text-xs text-green-300/80 space-y-1">
            <li>• Your data is encrypted and securely stored</li>
            <li>• We never share your personal information</li>
            <li>• Email verification required for account activation</li>
            <li>• Two-factor authentication available in settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}