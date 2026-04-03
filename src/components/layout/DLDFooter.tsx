import { Link } from 'react-router-dom';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/software-dev', label: 'Software Dev' },
  { to: '/about', label: 'About' },
  { to: '/blog', label: 'Blog' },
  { to: '/contact', label: 'Contact' },
];

const kingdomLinks = [
  { href: 'https://sotsvc.com', label: 'sotsvc.com' },
  { href: 'https://bossofclean.com', label: 'bossofclean.com' },
  { href: 'https://trustedcleaningexpert.com', label: 'trustedcleaningexpert.com' },
];

const connectLinks = [
  { href: 'https://www.youtube.com/@danielinthelionsden', label: 'YouTube' },
  { href: 'https://www.facebook.com/Daniel72144', label: 'Facebook' },
  { href: 'https://www.instagram.com/daniel_in_the_lions_den144', label: 'Instagram' },
  { href: 'https://x.com/dld14472', label: 'X (Twitter)' },
];

export function DLDFooter() {
  return (
    <footer
      className="py-16 px-8"
      style={{
        backgroundColor: '#001113',
        borderTop: '1px solid rgba(25,45,47,0.3)',
      }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1: Brand */}
        <div>
          <h3 className="font-newsreader italic text-2xl text-dld-gold mb-3">DLD</h3>
          <p className="font-manrope text-sm text-dld-text/80 mb-4">
            Builder. Believer. Transformer.
          </p>
          <p className="font-newsreader italic text-xs text-dld-muted/60">
            "Whatever you do, work at it with all your heart, as working for the Lord."
            <br />
            — Colossians 3:23
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <h4 className="font-manrope font-semibold text-xs uppercase tracking-widest text-dld-muted/50 mb-4">
            Navigation
          </h4>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="font-manrope text-sm text-dld-text/60 hover:text-dld-gold transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Kingdom */}
        <div>
          <h4 className="font-manrope font-semibold text-xs uppercase tracking-widest text-dld-muted/50 mb-4">
            Kingdom
          </h4>
          <ul className="space-y-2">
            {kingdomLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-sm text-dld-text/60 hover:text-dld-gold transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 4: Connect */}
        <div>
          <h4 className="font-manrope font-semibold text-xs uppercase tracking-widest text-dld-muted/50 mb-4">
            Connect
          </h4>
          <ul className="space-y-2">
            {connectLinks.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-manrope text-sm text-dld-text/60 hover:text-dld-gold transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-dld-navy/30">
        <p className="font-manrope text-xs text-dld-muted/40 text-center">
          &copy; 2026 Daniel in the Lion's Den | dld-online.com
        </p>
      </div>
    </footer>
  );
}
