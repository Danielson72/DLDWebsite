import { useState, useEffect } from 'react';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';

const inputStyle =
  'w-full bg-[#001113] border border-[#EEC14E]/20 text-dld-text px-4 py-3 rounded-lg text-sm font-manrope focus:outline-none focus:border-[#EEC14E]/50';

const services = [
  {
    title: 'Website Design & Development',
    items: [
      'Custom websites, landing pages, e-commerce',
      'Mobile-responsive, SEO-optimized',
      'Built with modern frameworks (Next.js, React, Tailwind)',
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <path d="M8 21h8M12 17v4" />
        <path d="M9 10l-2 2 2 2M15 10l2 2-2 2" />
      </svg>
    ),
  },
  {
    title: 'AI & Automation',
    items: [
      'AI chatbots and lead capture agents',
      'Automated email marketing and CRM setup',
      'Custom AI tools for your specific workflow',
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M12 2a4 4 0 0 1 4 4v1h1a3 3 0 0 1 3 3v2a3 3 0 0 1-3 3h-1v1a4 4 0 0 1-8 0v-1H7a3 3 0 0 1-3-3v-2a3 3 0 0 1 3-3h1V6a4 4 0 0 1 4-4z" />
        <circle cx="9.5" cy="10" r="1" fill="currentColor" />
        <circle cx="14.5" cy="10" r="1" fill="currentColor" />
        <path d="M9 14h6" />
      </svg>
    ),
  },
  {
    title: 'Marketing & Advertising',
    items: [
      'Social media management and content creation',
      'Google Ads, SEO, and local search optimization',
      'Brand strategy and visual identity',
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M3 11l18-5v12L3 13v-2z" />
        <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
      </svg>
    ),
  },
  {
    title: 'Software Development & IT',
    items: [
      'Custom web applications and SaaS platforms',
      'API integrations and database architecture',
      'Google Workspace, email, domain management',
      'IT consulting and tech stack optimization',
    ],
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="2" y="2" width="20" height="8" rx="2" />
        <rect x="2" y="14" width="20" height="8" rx="2" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="6" cy="18" r="1" fill="currentColor" />
        <path d="M10 6h6M10 18h6" />
      </svg>
    ),
  },
];

const portfolio = [
  { name: 'sotsvc.com', url: 'https://sotsvc.com', description: 'Commercial cleaning company — Sonz of Thunder Services' },
  { name: 'bossofclean.com', url: 'https://bossofclean.com', description: 'Cleaning marketplace connecting customers with top-rated pros' },
  { name: 'trustedcleaningexpert.com', url: 'https://trustedcleaningexpert.com', description: 'Cleaning education and referral platform' },
  { name: 'aicommandlab.com', url: 'https://aicommandlab.com', description: 'AI-powered SaaS platform for workflow automation' },
  { name: 'surfaceking.com', url: 'https://surfaceking.com', description: 'Asphalt, concrete, and ADA compliance contractor' },
  { name: 'surfacekingdevelopment.com', url: 'https://surfacekingdevelopment.com', description: 'General contractor site and development showcase' },
];

const trustPoints = [
  {
    title: 'We Use What We Build',
    desc: 'Every tool we recommend, we run on our own businesses first. No theory — tested in the real world.',
  },
  {
    title: 'AI-Powered, Human-Guided',
    desc: 'We leverage cutting-edge AI but every decision has a human behind it. Technology serves strategy, not the other way around.',
  },
  {
    title: 'Central Florida Based',
    desc: 'Local to Orlando and Apopka. We understand your market, your customers, and how to reach them.',
  },
  {
    title: 'Full Stack, One Team',
    desc: 'Website, marketing, AI, IT — you don\'t need four vendors. One team that actually communicates.',
  },
];

export function Services() {
  useEffect(() => {
    document.title = 'Digital Services | DLD Online — Websites, AI, Marketing, IT';
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.setAttribute('content', 'Custom websites, AI automation, digital marketing, and IT consulting for small businesses in Central Florida. One team, full stack — from concept to launch.');
    }
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', 'Digital Services | DLD Online');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', 'Websites. Apps. AI Automation. Marketing. All from one team that actually understands your business.');
  }, []);

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      // TODO: Wire to Supabase or webhook
      console.log('Services form submission:', form);
      // Simulate brief delay
      await new Promise((r) => setTimeout(r, 600));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      <DLDNav />

      {/* ── HERO ── */}
      <section
        className="relative py-28 md:py-36 px-6 text-center overflow-hidden"
        style={{ backgroundColor: '#000e0f' }}
      >
        {/* Subtle grid background */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(238,193,78,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(238,193,78,0.3) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="font-newsreader text-4xl md:text-5xl lg:text-6xl text-[#EEC14E] font-bold mb-6 leading-tight">
            We Build What Your Business Needs
          </h1>
          <p className="font-manrope text-lg md:text-xl text-dld-text/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Websites. Apps. AI Automation. Marketing. — All from one team that actually understands your business.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#contact"
              className="px-8 py-4 rounded-full font-manrope font-bold text-sm uppercase tracking-widest bg-[#EEC14E] text-[#001113] hover:brightness-110 transition"
            >
              Book a Free Discovery Call
            </a>
            <a
              href="#portfolio"
              className="px-8 py-4 rounded-full font-manrope font-bold text-sm uppercase tracking-widest border-2 border-[#EEC14E] text-[#EEC14E] hover:bg-[#EEC14E]/10 transition"
            >
              See Our Work
            </a>
          </div>
        </div>
      </section>

      {/* ── SERVICES GRID ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#091f21' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-newsreader text-3xl md:text-4xl text-[#EEC14E] font-bold text-center mb-4">
            What We Do
          </h2>
          <p className="font-manrope text-dld-muted/70 text-center mb-14 max-w-xl mx-auto">
            End-to-end digital services built for small businesses, contractors, and startups across Central Florida and beyond.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((svc) => (
              <div
                key={svc.title}
                className="group bg-[#192d2f] rounded-xl p-8 transition-all duration-300 hover:-translate-y-1"
                style={{
                  border: '1px solid rgba(238,193,78,0.1)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(238,193,78,0.4)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 32px rgba(238,193,78,0.08)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(238,193,78,0.1)';
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                }}
              >
                <div className="text-[#EEC14E] mb-4">{svc.icon}</div>
                <h3 className="font-newsreader text-xl text-dld-text font-bold mb-4">
                  {svc.title}
                </h3>
                <ul className="space-y-2">
                  {svc.items.map((item) => (
                    <li key={item} className="flex items-start gap-2 font-manrope text-sm text-dld-text/70">
                      <span className="text-[#EEC14E] mt-1 shrink-0">&#10003;</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PORTFOLIO ── */}
      <section id="portfolio" className="py-20 md:py-28 px-6 scroll-mt-16" style={{ backgroundColor: '#001113' }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="font-newsreader text-3xl md:text-4xl text-[#EEC14E] font-bold text-center mb-4">
            We Don't Just Talk — We Build. Here's Proof.
          </h2>
          <p className="font-manrope text-dld-muted/70 text-center mb-14 max-w-xl mx-auto">
            Live sites we designed, developed, and launched for real businesses.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((site) => (
              <a
                key={site.name}
                href={site.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#0e2325] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{ border: '1px solid rgba(238,193,78,0.1)' }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(238,193,78,0.3)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.border = '1px solid rgba(238,193,78,0.1)';
                }}
              >
                {/* Screenshot placeholder */}
                <div className="aspect-video bg-[#001315] flex items-center justify-center border-b border-[#EEC14E]/10">
                  <span className="font-manrope text-xs text-dld-muted/40 tracking-wide">{site.url.replace('https://', '')}</span>
                </div>
                <div className="p-5">
                  <h4 className="font-manrope font-bold text-sm text-dld-text mb-1 group-hover:text-[#EEC14E] transition-colors">
                    {site.name}
                  </h4>
                  <p className="font-manrope text-xs text-dld-muted/60 mb-3">
                    {site.description}
                  </p>
                  <span className="inline-flex items-center gap-1 font-manrope text-xs font-semibold text-[#EEC14E]/70 group-hover:text-[#EEC14E] transition-colors">
                    Visit Site
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
                      <path d="M6.22 4.22a.75.75 0 0 1 1.06 0l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06L8.94 8 6.22 5.28a.75.75 0 0 1 0-1.06z" />
                    </svg>
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY DLD ── */}
      <section className="py-20 md:py-28 px-6" style={{ backgroundColor: '#091f21' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="font-newsreader text-3xl md:text-4xl text-[#EEC14E] font-bold text-center mb-14">
            Why Work With Us?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {trustPoints.map((tp, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="shrink-0 w-10 h-10 rounded-full bg-[#EEC14E]/10 flex items-center justify-center">
                  <span className="text-[#EEC14E] font-manrope font-bold text-sm">{i + 1}</span>
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-dld-text mb-1">
                    {tp.title}
                  </h3>
                  <p className="font-manrope text-sm text-dld-muted/70 leading-relaxed">
                    {tp.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / CTA ── */}
      <section id="contact" className="py-20 md:py-28 px-6 scroll-mt-16" style={{ backgroundColor: '#001113' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-newsreader text-3xl md:text-4xl text-[#EEC14E] font-bold text-center mb-4">
            Ready to Build Something?
          </h2>
          <p className="font-manrope text-dld-muted/70 text-center mb-12">
            Tell us what you need — we'll follow up within 24 hours with a plan.
          </p>

          {status === 'success' ? (
            <div className="text-center py-12">
              <h3 className="font-newsreader text-2xl text-[#EEC14E] mb-2">
                Got it! We'll be in touch soon.
              </h3>
              <p className="font-manrope text-sm text-dld-muted/60">
                Expect a response within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className={inputStyle}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="(555) 123-4567"
                    className={inputStyle}
                  />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    What do you need help with?
                  </label>
                  <select
                    name="service"
                    value={form.service}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select one...</option>
                    <option value="Website">Website</option>
                    <option value="Marketing">Marketing</option>
                    <option value="AI/Automation">AI / Automation</option>
                    <option value="Software">Software</option>
                    <option value="IT Support">IT Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                  Brief message
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell us about your project or challenge..."
                  className={`${inputStyle} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-[#EEC14E] text-[#001113] font-manrope font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60"
              >
                {status === 'loading' ? 'Sending...' : "Let's Talk"}
              </button>

              {status === 'error' && (
                <p className="text-red-400 text-sm font-manrope mt-2 text-center">
                  Something went wrong. Please try again or email us directly.
                </p>
              )}
            </form>
          )}
        </div>
      </section>

      <DLDFooter />
    </>
  );
}
