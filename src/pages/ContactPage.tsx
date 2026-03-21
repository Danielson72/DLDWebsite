import { useState } from 'react';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { supabase } from '../lib/supabase';

const inputStyle =
  'w-full bg-[#001113] border border-[#EEC14E]/20 text-dld-text px-4 py-3 rounded-lg text-sm font-manrope focus:outline-none focus:border-[#EEC14E]/50';

export function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    project_type: '',
    budget: '',
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

    const { error } = await supabase.from('contact_submissions').insert({
      name: form.name,
      email: form.email,
      project_type: form.project_type || null,
      budget: form.budget || null,
      message: form.message,
      source: 'dld-online',
    });

    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  return (
    <>
      <DLDNav />

      {/* HERO */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: '#000e0f' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-newsreader text-4xl text-[#EEC14E] font-bold mb-4">
            Let's Build Something Kingdom-Worthy
          </h1>
          <p className="text-dld-muted text-lg font-manrope">
            Discovery calls are free. No pressure, no pitch.
          </p>
        </div>
      </section>

      {/* MAIN */}
      <section className="py-20 px-6" style={{ backgroundColor: '#091f21' }}>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* LEFT — FORM */}
          <div>
            {status === 'success' ? (
              <div className="text-center py-16">
                <span className="text-4xl block mb-4">✓</span>
                <h3 className="font-newsreader text-2xl text-[#EEC14E] mb-2">
                  Message received. 🦁
                </h3>
                <p className="text-dld-muted font-manrope text-sm mb-4">
                  I'll be in touch within 24 hours.
                </p>
                <p className="text-dld-muted/50 font-manrope text-xs">
                  No calls Saturday — Sabbath observed 🙏
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-0">
                {/* Name */}
                <div className="mb-5">
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

                {/* Email */}
                <div className="mb-5">
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

                {/* Project Type */}
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Project Type
                  </label>
                  <select
                    name="project_type"
                    value={form.project_type}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select one...</option>
                    <option value="Software Dev">Software Dev</option>
                    <option value="Cleaning Services">Cleaning Services</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Partnership">Partnership</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                {/* Budget */}
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Budget
                  </label>
                  <select
                    name="budget"
                    value={form.budget}
                    onChange={handleChange}
                    className={inputStyle}
                  >
                    <option value="">Select one...</option>
                    <option value="Under $1500">Under $1500</option>
                    <option value="$1500-$3500">$1500-$3500</option>
                    <option value="$3500-$10000">$3500-$10000</option>
                    <option value="$10000+">$10000+</option>
                    <option value="Let's discuss">Let's discuss</option>
                  </select>
                </div>

                {/* Message */}
                <div className="mb-5">
                  <label className="block text-xs uppercase tracking-wider text-dld-muted/60 mb-2 font-manrope">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project..."
                    className={`${inputStyle} resize-none`}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-[#EEC14E] text-[#001113] font-manrope font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60"
                >
                  {status === 'loading' ? 'Sending...' : 'Send It →'}
                </button>

                {status === 'error' && (
                  <p className="text-red-400 text-sm font-manrope mt-3 text-center">
                    Something went wrong. Please try again.
                  </p>
                )}
              </form>
            )}
          </div>

          {/* RIGHT — INFO PANEL */}
          <div>
            <div
              className="bg-[#192d2f] p-8 rounded-xl"
              style={{ border: '1px solid rgba(238,193,78,0.1)' }}
            >
              {/* Info rows */}
              {[
                { emoji: '⏱', label: 'Response Time', value: 'Typically within 24 hours' },
                { emoji: '📍', label: 'Location', value: 'Apopka, FL (Orlando Metro)' },
                { emoji: '🙏', label: 'Rest Day', value: 'No calls Saturday — Sabbath observed' },
                { emoji: '✉️', label: 'Email', value: 'danielinthelionsden72@gmail.com' },
              ].map((row) => (
                <div key={row.label} className="mb-6 last:mb-0">
                  <div className="flex items-start gap-3">
                    <span className="text-lg">{row.emoji}</span>
                    <div>
                      <span className="block font-manrope font-bold text-sm text-dld-text mb-0.5">
                        {row.label}
                      </span>
                      <span className="block font-manrope text-sm text-dld-muted/60">
                        {row.value}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Scripture */}
              <div className="mt-8 pt-6 border-t border-[#EEC14E]/10 text-center">
                <p className="font-newsreader italic text-[#EEC14E]/80 text-sm">
                  "Commit your work to the Lord, and your plans will succeed."
                </p>
                <span className="font-newsreader italic text-[#EEC14E]/50 text-xs mt-1 block">
                  — Proverbs 16:3
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <DLDFooter />
    </>
  );
}
