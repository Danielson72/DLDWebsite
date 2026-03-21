import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';

export function BlogPage() {
  return (
    <>
      <DLDNav />
      <section
        className="min-h-screen py-32 px-6 text-center"
        style={{ background: '#001315' }}>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4 font-manrope">
          Coming Soon
        </span>
        <h1 className="font-newsreader text-4xl text-[#EEC14E] font-bold mb-6">
          From the Den
        </h1>
        <p className="text-dld-muted font-manrope max-w-md mx-auto mb-10 leading-relaxed">
          Kingdom insights on faith, business, AI, and music. Dropping soon.
        </p>
        <ScriptureBanner
          verse="Write the vision and make it plain on tablets, that he may run who reads it."
          reference="— Habakkuk 2:2"
        />
      </section>
      <DLDFooter />
    </>
  );
}
