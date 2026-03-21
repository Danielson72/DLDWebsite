import { Link } from 'react-router-dom';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';

const services = [
  {
    icon: '⚡',
    name: 'Custom Web Applications',
    desc: 'Full-stack React apps on Netlify + Supabase. Fast, secure, scalable.',
  },
  {
    icon: '🤖',
    name: 'AI Automation Systems',
    desc: 'Multi-agent AI pipelines, skill-based automation, CRM workflows 24/7.',
  },
  {
    icon: '🎯',
    name: 'CRM & Lead Engine Build-outs',
    desc: 'GoHighLevel replacement systems — custom scoring, capture, notifications.',
  },
  {
    icon: '🗄️',
    name: 'Supabase + Netlify Deployments',
    desc: 'Database design, RLS security, Edge Functions, serverless APIs.',
  },
  {
    icon: '🚀',
    name: 'MVP Development',
    desc: 'Idea to deployed product — fast. Discovery → Design → Build → Deploy.',
  },
  {
    icon: '📍',
    name: 'SEO + Landing Page Systems',
    desc: 'City-specific pages, JSON-LD schema, Google Search Console. Built to rank.',
  },
];

const stackPills = [
  'Claude API', 'Supabase', 'Netlify', 'Stripe',
  'Next.js', 'React', 'Tailwind', 'TypeScript',
  'GitHub', 'OpenRouter', 'Resend', 'Gemini CLI',
];

export function SoftwareDev() {
  return (
    <>
      <DLDNav />

      {/* SECTION 1 — HERO */}
      <section
        className="min-h-[60vh] flex items-center justify-center"
        style={{
          backgroundColor: '#000e0f',
          backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 49px, rgba(238,193,78,0.04) 49px, rgba(238,193,78,0.04) 50px), repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(238,193,78,0.04) 49px, rgba(238,193,78,0.04) 50px)`,
        }}
      >
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span
            className="inline-block mb-6 rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-[#EEC14E] font-manrope"
            style={{ border: '0.5px solid rgba(238,193,78,0.3)' }}
          >
            Software Development · AI Systems
          </span>

          <h1 className="font-newsreader text-2xl sm:text-3xl md:text-5xl text-dld-text font-bold mb-6 leading-tight">
            We Don't Just Build Apps.
            <br />
            <span className="text-[#EEC14E]">We Build Automated Empires.</span>
          </h1>

          <p className="text-dld-muted text-lg max-w-lg mx-auto mb-10">
            AI-powered, faith-driven software — custom CRMs, multi-agent systems,
            Supabase + Netlify deployments that scale.
          </p>

          <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
            <Link
              to="/contact"
              className="w-full text-center rounded-full bg-[#EEC14E] py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#001113] hover:brightness-110 transition"
            >
              Get a Free Discovery Call
            </Link>
            <button
              onClick={() => document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full text-center rounded-full border-2 border-[#EEC14E] bg-transparent py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#EEC14E]/10 transition"
            >
              See Our Work
            </button>
          </div>
        </div>
      </section>

      {/* SECTION 2 — SCRIPTURE BANNER */}
      <ScriptureBanner
        verse="She considers a field and buys it; out of her earnings she plants a vineyard."
        reference="— Proverbs 31:16"
      />

      {/* SECTION 3 — SERVICES */}
      <section id="services" className="py-20 px-6" style={{ backgroundColor: '#091f21' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
            Services
          </span>
          <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-12">
            What We Build
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((svc) => (
              <div
                key={svc.name}
                className="bg-[#192d2f] p-6 rounded-lg border-t-2 border-[#EEC14E]/30 hover:border-[#EEC14E] transition-colors"
              >
                <div className="w-10 h-10 bg-[#EEC14E]/10 border border-[#EEC14E]/30 rounded-lg flex items-center justify-center mb-4 text-lg">
                  {svc.icon}
                </div>
                <h3 className="font-manrope font-bold text-base text-dld-text mb-2">{svc.name}</h3>
                <p className="text-sm text-dld-muted/70 font-manrope">{svc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — TECH STACK */}
      <section className="py-16 px-6" style={{ backgroundColor: '#001113' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
            The Stack
          </span>
          <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-10">
            Tools We Trust
          </h2>

          <div className="flex flex-wrap justify-center gap-3">
            {stackPills.map((tool) => (
              <span
                key={tool}
                className="rounded-full px-4 py-2 text-xs font-manrope font-semibold text-[#EEC14E] tracking-wide"
                style={{ border: '1px solid rgba(238,193,78,0.3)' }}
              >
                {tool}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — PROCESS TIMELINE */}
      <section className="py-20 px-6" style={{ backgroundColor: '#0e2325' }}>
        <div className="max-w-lg mx-auto">
          <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
            The Process
          </span>
          <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-12">
            How We Build
          </h2>

          <div className="relative">
            {/* Vertical gold line */}
            <div className="absolute left-5 top-0 bottom-0 w-px bg-gradient-to-b from-[#EEC14E] to-transparent" />

            {[
              { num: 1, name: 'Discovery', desc: 'Free call — understand your vision and goals' },
              { num: 2, name: 'Architecture', desc: 'Design the system blueprint before writing code' },
              { num: 3, name: 'Build Sprint', desc: 'Rapid development with regular check-ins' },
              { num: 4, name: 'Deploy', desc: 'Launch, test, go live on Netlify' },
              { num: 5, name: 'Support', desc: 'Ongoing maintenance and growth' },
            ].map((step) => (
              <div key={step.num} className="flex items-start gap-6 mb-10">
                <div className="z-10 w-10 h-10 shrink-0 rounded-full border-2 border-[#EEC14E] bg-[#0e2325] flex items-center justify-center font-newsreader font-bold text-[#EEC14E]">
                  {step.num}
                </div>
                <div>
                  <h3 className="font-manrope font-bold text-base text-dld-text mb-1">{step.name}</h3>
                  <p className="text-sm text-dld-muted/60 font-manrope">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — PRICING */}
      <section className="py-20 px-6" style={{ backgroundColor: '#001113' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
            Investment
          </span>
          <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-12">
            Kingdom Investment Tiers
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* STARTER */}
            <div className="bg-[#192d2f] p-8 rounded-lg border-t-4 border-dld-muted/20">
              <span className="block font-manrope text-[10px] uppercase tracking-[0.2em] text-dld-muted/50 mb-4">Starter</span>
              <div className="mb-6">
                <span className="font-newsreader text-4xl font-bold text-dld-text">$1,500</span>
                <span className="text-sm text-dld-muted/50 font-manrope ml-2">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Single-page app or landing page', 'Netlify deployment + config', 'Basic Supabase setup', 'SEO meta + JSON-LD schema', '14-day support'].map((f) => (
                  <li key={f} className="text-sm text-dld-muted/60 font-manrope">{f}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center rounded-full border-2 border-[#EEC14E] bg-transparent py-3 px-6 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#EEC14E]/10 transition"
              >
                Get Started
              </Link>
            </div>

            {/* BUILDER (FEATURED) */}
            <div
              className="relative bg-[#192d2f] p-8 rounded-lg border-2 border-[#EEC14E]"
              style={{ boxShadow: '0 0 30px rgba(238,193,78,0.1)' }}
            >
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#EEC14E] text-[#001113] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest whitespace-nowrap font-manrope">
                Most Popular
              </span>
              <span className="block font-manrope text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4">Builder</span>
              <div className="mb-6">
                <span className="font-newsreader text-4xl font-bold text-[#EEC14E]">$3,500</span>
                <span className="text-sm text-dld-muted/50 font-manrope ml-2">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Multi-page full-stack application', 'AI automation integration', 'CRM + lead engine setup', 'Stripe billing integration', '30-day support'].map((f) => (
                  <li key={f} className="text-sm text-dld-text/80 font-manrope">{f}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center rounded-full bg-[#EEC14E] py-3 px-6 text-sm font-manrope font-bold uppercase tracking-widest text-[#001113] hover:brightness-110 transition"
              >
                Let's Build
              </Link>
            </div>

            {/* KINGDOM */}
            <div className="bg-[#192d2f] p-8 rounded-lg border-t-4 border-dld-muted/20">
              <span className="block font-manrope text-[10px] uppercase tracking-[0.2em] text-dld-muted/50 mb-4">Kingdom</span>
              <div className="mb-6">
                <span className="font-newsreader text-4xl font-bold text-dld-text">Custom</span>
                <span className="text-sm text-dld-muted/50 font-manrope ml-2">retainer / full build</span>
              </div>
              <ul className="space-y-3 mb-8">
                {['Full ecosystem architecture', 'Multi-agent AI systems', 'Custom CRM platform', 'Ongoing retainer', 'Priority support'].map((f) => (
                  <li key={f} className="text-sm text-dld-muted/60 font-manrope">{f}</li>
                ))}
              </ul>
              <Link
                to="/contact"
                className="block w-full text-center rounded-full border-2 border-[#EEC14E] bg-transparent py-3 px-6 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#EEC14E]/10 transition"
              >
                Book a Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7 — FINAL CTA */}
      <section
        className="py-20 px-6 text-center"
        style={{
          backgroundColor: '#091f21',
          borderTop: '1px solid rgba(238,193,78,0.3)',
        }}
      >
        <h2 className="font-newsreader text-4xl text-[#EEC14E] font-bold mb-3">
          Let's build something that outlasts you.
        </h2>
        <p className="text-dld-muted font-manrope mb-10">
          Kingdom-grade software for Kingdom-minded builders.
        </p>
        <div className="max-w-xs mx-auto flex flex-col gap-4">
          <Link
            to="/contact"
            className="w-full text-center rounded-full bg-[#EEC14E] py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#001113] hover:brightness-110 transition"
          >
            Book Your Discovery Call
          </Link>
          <a
            href="mailto:danielinthelionsden72@gmail.com"
            className="w-full text-center rounded-full border-2 border-[#EEC14E] bg-transparent py-4 px-8 text-sm font-manrope font-bold uppercase tracking-widest text-[#EEC14E] hover:bg-[#EEC14E]/10 transition"
          >
            Email Daniel
          </a>
        </div>
      </section>

      <DLDFooter />
    </>
  );
}
