import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useFadeIn } from '../../hooks/useFadeIn';

export function LeadCapture() {
  const ref = useFadeIn(150)
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    const { error } = await supabase
      .from('subscribers')
      .insert({ email, source: 'dld-home' });

    if (error) {
      // Duplicate email is still a "success" from the user's perspective
      if (error.code === '23505') {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } else {
      setStatus('success');
    }

    setEmail('');
  };

  return (
    <section ref={ref as any} className="py-20 px-6" style={{ backgroundColor: '#001113' }}>
      <div
        className="max-w-lg mx-auto rounded-xl p-10 text-center"
        style={{
          backgroundColor: '#192d2f',
          border: '1px solid rgba(238,193,78,0.20)',
        }}
      >
        <h2 className="font-newsreader italic text-3xl text-[#EEC14E] mb-3">
          Get Kingdom Intel First
        </h2>

        <p className="font-manrope text-sm text-dld-muted/70 mb-8">
          Faith. Business. AI.<br />
          Straight to your inbox.
        </p>

        {status === 'success' ? (
          <p className="font-manrope text-lg text-[#EEC14E]">
            You're in the den. 🦁
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              required
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#001113] border border-[#EEC14E]/20 text-dld-text px-6 py-4 rounded-lg text-sm font-manrope placeholder:text-dld-muted/30 focus:outline-none focus:border-[#EEC14E]/50"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-[#EEC14E] text-[#001113] font-manrope font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:brightness-110 transition disabled:opacity-60"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </form>
        )}

        {status === 'error' && (
          <p className="font-manrope text-sm text-red-400 mt-3">Something went wrong. Try again.</p>
        )}

        <p className="font-manrope text-xs text-dld-muted/40 mt-6">
          No spam. Sabbath observed. 🦁
        </p>
      </div>
    </section>
  );
}
