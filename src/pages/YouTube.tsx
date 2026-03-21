import { DLDNav } from '../components/layout/DLDNav'
import { DLDFooter } from '../components/layout/DLDFooter'
import { ScriptureBanner } from '../components/ui/ScriptureBanner'

export function YouTube() {
  const pillars = [
    {
      num: '01',
      title: 'Faith & Kingdom Commerce',
      desc: 'Building businesses that honor God. Real talk on Kingdom entrepreneurship.'
    },
    {
      num: '02',
      title: 'Tech & AI Building',
      desc: 'Building David, AI systems, Claude Code — raw and unfiltered.'
    },
    {
      num: '03',
      title: 'Music & Creative',
      desc: 'Behind the scenes of the 12-song Bible album and BeatSlave productions.'
    },
    {
      num: '04',
      title: 'Business & Entrepreneurship',
      desc: 'Running nine businesses simultaneously. What works, what doesn\'t.'
    },
  ]

  return (
    <>
      <DLDNav />

      <section className="py-24 px-6 text-center" style={{ background: '#000e0f' }}>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4 font-manrope">
          YouTube Channel
        </span>
        <h1 className="font-newsreader text-4xl md:text-5xl text-[#EEC14E] font-bold mb-4">
          Watch the Journey
        </h1>
        <p className="text-dld-muted font-manrope max-w-md mx-auto mb-8">
          Faith. Business. AI. Music. All documented in real time.
        </p>
        <a
          href="https://www.youtube.com/@danielinthelionsden"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#F7D97A] transition">
          Subscribe on YouTube →
        </a>
      </section>

      <ScriptureBanner
        verse="And whatsoever ye do, do it heartily, as to the Lord, and not unto men."
        reference="— Colossians 3:23 (KJV)" />

      <section className="py-20 px-6" style={{ background: '#091f21' }}>
        <div className="max-w-4xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] text-center mb-3 font-manrope">
            Content Pillars
          </span>
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold text-center mb-12">
            What You'll Find on the Channel
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pillars.map(p => (
              <div key={p.num}
                className="bg-[#192d2f] p-6 rounded-lg border-l-2 border-[#EEC14E]">
                <span className="text-[10px] text-dld-muted/40 font-manrope block mb-2">{p.num}</span>
                <h3 className="font-manrope font-bold text-base text-dld-text mb-2">
                  {p.title}
                </h3>
                <p className="text-sm text-dld-muted/70 font-manrope leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-6 text-center"
        style={{
          background: '#091f21',
          borderTop: '1px solid rgba(238,193,78,0.3)'
        }}>
        <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold mb-4">
          Join the Den
        </h2>
        <p className="text-dld-muted font-manrope mb-8">
          Subscribe and never miss a drop.
        </p>
        <a
          href="https://www.youtube.com/@danielinthelionsden"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block px-8 py-4 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#F7D97A] transition">
          Subscribe Now →
        </a>
      </section>

      <DLDFooter />
    </>
  )
}