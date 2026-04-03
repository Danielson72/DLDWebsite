import { useState } from 'react';
import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/software-development', label: 'Software Dev' },
  { to: '/music', label: 'Music' },
  { to: '/youtube', label: 'YouTube' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

export function DLDNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="sticky top-0 z-50 h-16 flex items-center backdrop-blur relative"
      style={{
        backgroundColor: 'rgba(2,22,24,0.8)',
        borderBottom: '1px solid rgba(238,193,78,0.1)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/images/dld-logo.png?v=4"
            alt="DLD Logo"
            className="w-10 h-10 object-contain"
            style={{ background: 'transparent' }}
          />
          <span className="font-newsreader italic text-xl text-[#EEC14E] hidden sm:block">
            DLD
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-manrope font-semibold text-dld-text/70 hover:text-dld-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}

          <Link
            to="/contact"
            className="ml-2 px-5 py-2 rounded-full text-sm font-manrope font-semibold bg-dld-gold text-dld-dark hover:bg-dld-amber transition-colors"
          >
            Book a Call
          </Link>
        </nav>

        {/* Mobile right side */}
        <div className="md:hidden flex items-center gap-3">
          <Link to="/contact"
            className="px-4 py-1.5 rounded-full text-xs font-manrope font-bold bg-[#EEC14E] text-[#001315]">
            Book a Call
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex flex-col gap-1.5 p-2 cursor-pointer"
            aria-label="Toggle menu">
            <span className={`block w-6 h-0.5 bg-[#EEC14E] transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block w-6 h-0.5 bg-[#EEC14E] transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`}/>
            <span className={`block w-6 h-0.5 bg-[#EEC14E] transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 z-50 flex flex-col gap-1 py-4 px-6"
          style={{
            background: 'rgba(0,14,15,0.98)',
            borderBottom: '1px solid rgba(238,193,78,0.2)',
            backdropFilter: 'blur(12px)',
          }}>
          {[
            { to: '/', label: 'Home' },
            { to: '/services', label: 'Services' },
            { to: '/software-development', label: 'Software Dev' },
            { to: '/music', label: 'Music' },
            { to: '/youtube', label: 'YouTube' },
            { to: '/about', label: 'About' },
            { to: '/blog', label: 'Blog' },
            { to: '/contact', label: 'Contact' },
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className="font-manrope text-sm text-dld-text hover:text-[#EEC14E] py-3 border-b border-[#EEC14E]/10 transition-colors last:border-0">
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
