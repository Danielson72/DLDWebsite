import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/software-dev', label: 'Software Dev' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
];

export function DLDNav() {
  return (
    <header
      className="sticky top-0 z-50 h-16 flex items-center backdrop-blur"
      style={{
        backgroundColor: 'rgba(2,22,24,0.8)',
        borderBottom: '1px solid rgba(238,193,78,0.1)',
      }}
    >
      <div className="w-full max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/icons/logo-40.png"
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

        {/* Mobile: Book a Call only (hamburger is future) */}
        <div className="md:hidden">
          <Link
            to="/contact"
            className="px-4 py-1.5 rounded-full text-sm font-manrope font-semibold bg-dld-gold text-dld-dark hover:bg-dld-amber transition-colors"
          >
            Book a Call
          </Link>
        </div>
      </div>
    </header>
  );
}
