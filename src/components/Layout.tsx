import { Menu } from 'lucide-react';
import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/welcome';

  return (
    <div className={`relative min-h-screen ${!isHomePage ? 'matrix-background' : 'bg-black'}`}>
      {/* Fixed Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-amber-500 hover:text-amber-400 transition-colors">
                Welcome to the Lion's Den
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/about" className="text-white hover:text-amber-500 transition-colors">About</Link>
              <Link to="/music" className="text-white hover:text-amber-500 transition-colors">Music</Link>
              <Link to="/ministry" className="text-white hover:text-amber-500 transition-colors">Ministry</Link>
              <Link to="/services" className="text-white hover:text-amber-500 transition-colors">Services</Link>
              <Link to="/youtube" className="text-white hover:text-amber-500 transition-colors">YouTube</Link>
              <Link to="/contact" className="text-white hover:text-amber-500 transition-colors">Contact</Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-amber-500 transition-colors"
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/95">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link to="/about" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">About</Link>
              <Link to="/music" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">Music</Link>
              <Link to="/ministry" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">Ministry</Link>
              <Link to="/services" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">Services</Link>
              <Link to="/youtube" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">YouTube</Link>
              <Link to="/contact" className="block px-3 py-2 text-white hover:text-amber-500 transition-colors">Contact</Link>
            </div>
          </div>
        )}
      </nav>

      {/* Page Content */}
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
}