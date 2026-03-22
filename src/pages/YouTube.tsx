import { DLDNav } from '../components/layout/DLDNav'
import { DLDFooter } from '../components/layout/DLDFooter'
import { ScriptureBanner } from '../components/ui/ScriptureBanner'

export function YouTube() {
  const videos = [
    {
      id: '7ExbgN4pYC4',
      title: 'Elite Vocal Chain Setup',
      category: 'Faith / Kingdom Commerce'
    },
    {
      id: 'M8c7JlutBd8',
      title: 'Professional Vocal Processing',
      category: 'Tech / AI Building'
    },
    {
      id: 'WD70IBOCwcU',
      title: 'Microphone Shootout Comparison',
      category: 'Business / Entrepreneurship'
    },
  ]

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

      <section className="py-20 px-6" style={{ background: '#001315' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] text-center mb-3 font-manrope">
            Latest Videos
          </span>
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold text-center mb-12">
            Watch the Latest
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videos.map(v => (
              <a
                key={v.id}
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group block bg-[#192d2f] rounded-xl overflow-hidden border border-[#EEC14E]/20 hover:border-[#EEC14E] transition-all duration-200 hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`}
                    alt={v.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-all">
                    <div className="w-14 h-14 rounded-full bg-[#EEC14E] flex items-center justify-center group-hover:scale-110 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="#001315">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <span className="text-[10px] uppercase tracking-wider text-[#EEC14E]/60 font-manrope block mb-1">
                    {v.category}
                  </span>
                  <h3 className="font-newsreader text-base text-dld-text group-hover:text-[#EEC14E] transition-colors leading-snug">
                    {v.title}
                  </h3>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-10">
            <a
              href="https://www.youtube.com/@danielinthelionsden"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block px-8 py-3 border border-[#EEC14E]/40 text-[#EEC14E] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#EEC14E]/10 transition">
              View All Videos →
            </a>
          </div>
        </div>
      </section>

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