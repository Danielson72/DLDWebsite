import { Menu, LogOut, User as UserIcon } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { User } from '@supabase/supabase-js';
import { Footer } from './Footer';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const navigationItems = [
    { path: '/about', label: 'About', description: 'Learn about Daniel Alvarez and his mission' },
    { path: '/music', label: 'Music', description: 'Kingdom music and digital downloads' },
    { path: '/my-music', label: 'My Music', description: 'Your purchased music collection', authRequired: true },
    { path: '/ministry', label: 'Ministry', description: 'Spiritual guidance and community outreach' },
    { path: '/services', label: 'Services', description: 'Worship services and events schedule' },
    { path: '/youtube', label: 'YouTube', description: 'Video content and teachings' },
    { path: '/contact', label: 'Contact', description: 'Get in touch with us' }
  ];

  return (
    <div className={`relative min-h-screen flex flex-col ${!isHomePage ? 'matrix-background' : 'bg-black'} overflow-x-hidden`}>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm border-b border-green-500/20">
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
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 text-green-300">
                      <UserIcon size={14} className="sm:size-4" />
                      <span className="text-xs sm:text-sm font-medium">
                        {user.email?.split('@')[0]}
                      </span>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-1 text-red-400 hover:text-red-300 transition-colors text-xs sm:text-sm"
                      title="Sign out"
                    >
                      <LogOut size={12} className="sm:size-3" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      to="/login"
                      className="text-white hover:text-amber-500 transition-colors font-medium text-xs sm:text-sm"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg transition-colors text-xs sm:text-sm"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-500 transition-colors p-2"
                aria-label="Toggle mobile menu"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 top-16 bg-black/95 backdrop-blur-sm z-40">
            <div className="px-4 pt-4 pb-6 space-y-1 h-full overflow-y-auto">
              {navigationItems.map((item) => {
                // Skip auth-required items if user is not logged in
                if (item.authRequired && !user) return null;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`block px-4 py-4 text-white hover:text-amber-500 hover:bg-amber-500/10 rounded-lg transition-colors ${
                      location.pathname === item.path ? 'text-amber-500 bg-amber-500/10' : ''
                    }`}
                  >
                    <div className="font-medium text-base">{item.label}</div>
                    <div className="text-xs text-gray-400 mt-1">{item.description}</div>
                  </Link>
                );
              })}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-green-500/20 pt-4 mt-4 space-y-3">
                {user ? (
                  <>
                    <div className="px-4 py-2 text-green-300 flex items-center gap-2">
                      <UserIcon size={16} />
                      <span className="text-sm">Signed in as: {user.email?.split('@')[0]}</span>
                    </div>
                    <button
                      onClick={() => {
                        handleSignOut();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full mx-4 text-center bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-3 rounded-lg transition-colors"
                    >
                      <LogOut size={16} className="inline mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mx-4 text-center bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-4 py-3 rounded-lg transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="block mx-4 text-center bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-3 rounded-lg transition-colors"
                    >
                      Register Account
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="flex-1 pt-16 overflow-x-hidden">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}