import { Link } from 'react-router-dom'
import { useFadeIn } from '../../hooks/useFadeIn'

const businesses = [
  { name: 'SOTSVC', desc: 'We Bring the Boom to Every Room', href: 'https://sotsvc.com' },
  { name: 'Boss of Clean', desc: 'Home Service Marketplace', href: 'https://bossofclean.com' },
  { name: 'TrustedCleaningExpert', desc: "YOU'RE CLEAN OR YOU'RE DIRTY", href: 'https://trustedcleaningexpert.com' },
  { name: 'AI Command Lab', desc: 'Custom CRM & Automation Platform', href: 'https://aicommandlab.com' },
  { name: 'BeatSlave', desc: 'Gospel \u00b7 Hip-Hop \u00b7 Drum & Bass', href: 'https://beatslavemusic.com' },
  { name: 'HalleluYAH Worship Wear', desc: 'Wear Your Worship', href: '/shop', internal: true },
  { name: 'AllCalculate', desc: 'SaaS Calculator Platform', comingSoon: true },
  { name: 'TempleBuilderApp', desc: 'Faith meets Entrepreneurship', comingSoon: true },
] as const;

export function EcosystemSection() {
  const ref = useFadeIn()
  return (
    <section ref={ref as any} className="py-20 px-6" style={{ backgroundColor: '#091f21' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section tag */}
        <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
          The Ecosystem
        </span>

        {/* H2 */}
        <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-4">
          Nine Businesses. One Kingdom Vision.
        </h2>

        {/* Gold ray divider */}
        <div className="w-px h-24 bg-gradient-to-b from-[#EEC14E] to-transparent mx-auto mb-12" />

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card */}
          <div className="md:col-span-2 lg:col-span-3 bg-[#192d2f] p-6 rounded-lg border border-[#EEC14E]">
            <h3 className="font-manrope font-bold text-lg text-dld-text mb-1">DLD-Online.com</h3>
            <p className="font-manrope text-sm text-dld-muted/70">
              The Hub — Kingdom Commerce HQ. You are here.
            </p>
          </div>

          {/* Regular cards */}
          {businesses.map((biz) => {
            const inner = (
              <>
                <h3 className="font-manrope font-bold text-base text-dld-text mb-1">{biz.name}</h3>
                <p className="font-manrope text-sm text-dld-muted/60">{biz.desc}</p>
                {'comingSoon' in biz && biz.comingSoon && (
                  <span className="text-[9px] text-dld-muted/40 font-manrope italic">Coming Soon</span>
                )}
              </>
            );

            const cardClass = "bg-[#192d2f] p-6 rounded-lg border border-[#EEC14E]/10 hover:border-[#EEC14E]/40 transition-colors";

            if ('internal' in biz && biz.internal && 'href' in biz) {
              return (
                <Link key={biz.name} to={biz.href} className={cardClass}>
                  {inner}
                </Link>
              );
            }

            if ('href' in biz && biz.href) {
              return (
                <a
                  key={biz.name}
                  href={biz.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClass}
                >
                  {inner}
                </a>
              );
            }

            return (
              <div key={biz.name} className="bg-[#192d2f] p-6 rounded-lg border border-[#EEC14E]/10">
                {inner}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
