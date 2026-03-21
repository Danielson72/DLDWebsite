import { DLDNav } from '../components/layout/DLDNav';
import { HeroSection } from '../components/sections/HeroSection';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';
import { EcosystemSection } from '../components/sections/EcosystemSection';
import { FourPillars } from '../components/sections/FourPillars';
import { LeadCapture } from '../components/sections/LeadCapture';
import { AboutDaniel } from '../components/sections/AboutDaniel';
import { CTABanner } from '../components/sections/CTABanner';
import { DLDFooter } from '../components/layout/DLDFooter';

export function HomePage() {
  return (
    <>
      <DLDNav />
      <HeroSection />
      <ScriptureBanner
        verse="And whatsoever ye do, do it heartily, as to the Lord, and not unto men."
        reference="— Colossians 3:23 (KJV)"
      />
      <div id="ecosystem">
        <EcosystemSection />
      </div>
      <FourPillars />
      <LeadCapture />
      <AboutDaniel />
      <CTABanner />
      <DLDFooter />
    </>
  );
}
