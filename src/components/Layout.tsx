import { Menu, LogOut, User as UserIcon, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Footer } from './Footer';
import { AuthModalV2 } from './auth/AuthModal-v2';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [showAvatarMenu, setShowAvatarMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/welcome';

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Handle mobile menu toggle with body class management
  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      document.body.classList.add('nav-open', 'no-scroll');
    } else {
      document.body.classList.remove('nav-open', 'no-scroll');
    }
  };

  // Close mobile menu
  const closeMobileMenu = () => {
    setIsMenuOpen(false);
    document.body.classList.remove('nav-open', 'no-scroll');
  };

  // Close avatar menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (showAvatarMenu && !target.closest('.avatar-menu-container')) {
        setShowAvatarMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showAvatarMenu]);
  // Clean up body classes on unmount
  useEffect(() => {
    return () => {
      document.body.classList.remove('nav-open', 'no-scroll');
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setShowAvatarMenu(false);
  };

  const navigationItems = [
    { path: '/about', label: 'About', description: 'Learn about Daniel Alvarez and his mission' },
    { path: '/music', label: 'Music', description: 'Kingdom music and digital downloads' },
    { path: '/my-music', label: 'My Music', description: 'Your purchased music collection', authRequired: true },
    { path: '/dashboard', label: 'Dashboard', description: 'Your personal dashboard', authRequired: true },
    { path: '/ministry', label: 'Ministry', description: 'Spiritual guidance and community outreach' },
    { path: '/services', label: 'Services', description: 'Worship services and events schedule' },
    { path: '/youtube', label: 'YouTube', description: 'Video content and teachings' },
    { path: '/contact', label: 'Contact', description: 'Get in touch with us' }
  ];

  return (
    <div className={`relative min-h-screen flex flex-col ${!isHomePage ? 'matrix-background' : 'bg-black'} overflow-x-hidden`}>
      {/* Fixed Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center group">
              <span className="text-lg sm:text-xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
                Welcome to the Lion's Den
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              {navigationItems.map((item) => {
                // Skip auth-required items if user is not logged in
                if (item.authRequired && !user) return null;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`relative text-white hover:text-amber-500 transition-colors font-medium text-sm xl:text-base ${
                      location.pathname === item.path ? 'text-amber-500' : ''
                    }`}
                    title={item.description}
                  >
                    {item.label}
                    {location.pathname === item.path && (
                      <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-amber-500"></div>
                    )}
                  </Link>
                );
              })}
              
              {/* Auth Section */}
              <div className="flex items-center gap-2 border-l border-green-500/30 pl-4">
                {loading ? (
                  <div className="w-6 h-6 sm:w-8 sm:h-8 animate-spin rounded-full border-b-2 border-amber-500"></div>
                ) : user ? (
                  <div className="relative avatar-menu-container">
                    <button
                      onClick={() => setShowAvatarMenu(!showAvatarMenu)}
                      className="flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors"
                    >
                      <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                        <UserIcon size={16} className="text-black" />
                      </div>
                      <span className="text-sm font-medium hidden xl:inline">
                        {user.email?.split('@')[0]}
                      </span>
                    </button>

                    {/* Avatar Dropdown Menu */}
                    {showAvatarMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-lg py-2 z-50">
                        <div className="px-4 py-2 border-b border-green-500/20">
                          <p className="text-sm text-gray-300">Signed in as</p>
                          <p className="text-sm font-medium text-amber-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowAvatarMenu(false)}
                          className="flex items-center gap-2 px-4 py-2 text-white hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                        >
                          <UserIcon size={16} />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleSignOut}
                          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
                        >
                          <LogOut size={16} />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors text-sm"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMobileMenu}
                className="hamburger text-white hover:text-amber-500 transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <nav 
        id="mobileMenu"
        className={`lg:hidden fixed top-0 left-0 h-full w-full bg-black/90 backdrop-blur-lg z-50 overflow-y-auto transition-transform duration-300 ease-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-[-100%]'
        }`}
      >
        <div className="pt-20 pb-6 px-6">
          {/* Close Button */}
          <button
            onClick={closeMobileMenu}
            className="close-btn absolute top-4 right-4 text-white hover:text-amber-500 transition-colors p-2"
            aria-label="Close mobile menu"
          >
            <X size={24} />
          </button>

          {/* Navigation Links */}
          <div className="flex flex-col gap-4 text-center">
            {navigationItems.map((item) => {
              // Skip auth-required items if user is not logged in
              if (item.authRequired && !user) return null;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`text-xl font-bold tracking-wide py-4 px-6 rounded-lg transition-colors ${
                    location.pathname === item.path 
                      ? 'text-amber-500 bg-amber-500/10' 
                      : 'text-white hover:text-amber-500 hover:bg-amber-500/10'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            
            {/* Mobile Auth Section */}
            <div className="border-t border-green-500/20 pt-6 mt-6 space-y-4">
              {user ? (
                <>
                  <div className="text-green-300 text-center">
                    <UserIcon size={20} className="mx-auto mb-2" />
                    <span className="text-lg font-medium">Signed in as:</span>
                    <br />
                    <span className="text-amber-500">{user.email?.split('@')[0]}</span>
                  </div>
                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMobileMenu();
                    }}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setShowAuthModal(true);
                    closeMobileMenu();
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-4 px-6 rounded-lg transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Auth Modal */}
      <AuthModalV2
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Refresh to update auth state
          window.location.reload();
        }}
      />
      {/* Page Content */}
      <main className="flex-1 pt-16 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}