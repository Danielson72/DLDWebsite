import { Link } from 'react-router-dom';
import { useFadeIn } from '../../hooks/useFadeIn'

export function CTABanner() {
  const ref = useFadeIn()
  return (
    <section
      ref={ref as any}
      className="py-20 px-6 text-center"
      style={{
        backgroundColor: '#091f21',
        borderTop: '1px solid rgba(238,193,78,0.3)',
      }}
    >
      <h2 className="font-newsreader text-4xl text-[#EEC14E] font-bold mb-10">
        Ready to build something<br />Kingdom-worthy?
      </h2>

      <div className="max-w-xs mx-auto flex flex-col gap-4">
        <Link
          to="/contact"
          className="w-full bg-[#EEC14E] text-[#001113] font-manrope font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:brightness-110 transition text-center"
        >
          Book a Discovery Call
        </Link>
        <a
          href="#ecosystem"
          className="w-full border-2 border-[#EEC14E] text-[#EEC14E] bg-transparent font-manrope font-bold py-4 rounded-full uppercase tracking-widest text-sm hover:bg-[#EEC14E]/10 transition text-center"
        >
          Explore the Ecosystem
        </a>
      </div>
    </section>
  );
}
