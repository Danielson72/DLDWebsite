const pillars = [
  {
    num: '01',
    title: 'Faith / Kingdom Commerce',
    desc: 'Business as ministry. Biblical principles and covenant purpose.',
  },
  {
    num: '02',
    title: 'Tech / AI Building',
    desc: 'Custom software, multi-agent AI, automation that works while you rest.',
  },
  {
    num: '03',
    title: 'Music / Creative',
    desc: '12-song Bible album, BeatSlave productions, expression as worship.',
  },
  {
    num: '04',
    title: 'Business / Entrepreneurship',
    desc: 'Real operator wisdom from nine interconnected Kingdom businesses.',
  },
];

export function FourPillars() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#0e2325' }}>
      <div className="max-w-7xl mx-auto">
        {/* Section tag */}
        <span className="block mb-3 text-center text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] font-manrope">
          Content Pillars
        </span>

        {/* H2 */}
        <h2 className="text-center font-newsreader text-4xl text-[#EEC14E] font-bold mb-12">
          Four Dimensions of the Den
        </h2>

        {/* 2x2 grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pillars.map((p) => (
            <div
              key={p.num}
              className="bg-[#192d2f] p-6 rounded-lg border-l-2 border-[#EEC14E]"
            >
              <span className="font-manrope text-xs text-dld-muted/40 block mb-2">{p.num}</span>
              <h3 className="font-manrope font-bold text-base text-dld-text mb-2">{p.title}</h3>
              <p className="font-manrope text-sm text-dld-muted/60">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
