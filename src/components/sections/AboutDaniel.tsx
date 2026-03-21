export function AboutDaniel() {
  return (
    <section className="py-20 px-6" style={{ backgroundColor: '#091f21' }}>
      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div className="w-24 h-24 rounded-full border-2 border-[#EEC14E] bg-[#001315] overflow-hidden mb-6 flex items-center justify-center p-2">
          <img
            src="/images/dld-logo.png"
            alt="DLD Lion Logo"
            className="w-full h-full object-contain"
          />
        </div>

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
