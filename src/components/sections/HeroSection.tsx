import { Link } from 'react-router-dom';

const heroImage = '/images/dld-hero.png';

export function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden hero-bg"
      style={{
        backgroundImage: `url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: '50% 20%',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
      }}
    >
      {/* LAYER 1 — Background image (div with CSS background for navigation resilience) */}
      <div
        className="absolute inset-0 w-full h-full hero-bg"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover',
          backgroundPosition: '50% 20%',
          backgroundRepeat: 'no-repeat',
        }}
        role="img"
        aria-label="Daniel in the Lion's Den — Kingdom Commerce hero"
      />

      {/* LAYER 2 — Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom,
            rgba(0,19,21,0.35) 0%,
            rgba(0,19,21,0.15) 20%,
            rgba(0,19,21,0.20) 45%,
            rgba(0,19,21,0.45) 62%,
            rgba(0,19,21,0.25) 72%,
            rgba(0,19,21,0.30) 82%,
            rgba(0,17,19,0.95) 95%,
            rgba(0,17,19,1.00) 100%)`,
        }}
      />

      {/* LAYER 3 — Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-start pt-[62vh] px-6 pb-10">
        {/* Eyebrow pill */}
        <span
          className="mb-4 inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#EEC14E] font-manrope bg-[#001315]/90"
          style={{ border: '1.5px solid rgba(238,193,78,0.7)' }}
        >
          Kingdom Commerce &middot; Faith &middot; Technology &middot; Music
        </span>

        {/* Scripture */}
        <p className="mb-8 font-newsreader italic text-[13px] text-[#EEC14E] text-center max-w-sm bg-[#001315]/80 px-4 py-1 rounded-lg">
          "And whatsoever ye do, do it heartily, as to the Lord"
        </p>

        {/* Primary CTA */}
        <Link
          to="/contact"
          className="mb-3 w-full max-w-xs text-center rounded-full bg-[#001315] py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#002328] transition"
          style={{ border: '2px solid rgba(238,193,78,0.8)' }}
        >
          Start Your Transformation
        </Link>

        {/* Secondary CTA */}
        <Link
          to="/about"
          className="mb-10 w-full max-w-xs text-center rounded-full bg-[#001315]/80 py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#002328] transition"
          style={{ border: '2px solid rgba(238,193,78,0.5)' }}
        >
          Watch the Journey
        </Link>

        {/* Scroll indicator */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-manrope text-[10px] uppercase tracking-[0.3em] text-[#EEC14E]">
            Scroll
          </span>
          <div className="w-px h-10 bg-[#EEC14E]/60" />
        </div>
      </div>
    </section>
  );
}
