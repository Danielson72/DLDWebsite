export function AboutDaniel() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#091f21' }}>
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <img
          src="/images/dld-logo.png"
          alt="DLD Lion Logo"
          className="w-32 h-32 object-contain mb-6"
          style={{
            mixBlendMode: 'lighten',
            filter: 'drop-shadow(0 0 8px rgba(238,193,78,0.4))',
          }}
        />

        {/* Name */}
        <h2 className="font-newsreader text-2xl text-[#EEC14E] mb-1">Daniel Alvarez</h2>

        {/* Tagline */}
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#EEC14E]/60 mb-6 font-manrope">
          Builder · Believer · Transformer
        </span>

        {/* Bio */}
        <p className="max-w-sm text-sm text-dld-muted font-manrope leading-relaxed">
          Faith-centered entrepreneur, software developer, musician, and author of{' '}
          <em className="text-dld-text">Transformer: Transform Into Who God Calls You to Be</em>.
          Based in Apopka, FL — nine businesses, one AI agent named David, and a 12-song Bible
          album. Colossians 3:23 is the standard.
        </p>
      </div>
    </section>
  );
}
