import { PageHero } from '../components/PageHero';

export function Services() {
  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Our Services" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="relative prose prose-lg prose-invert mx-auto">
          <p className="text-gray-300">
            Content from config will go here
          </p>
        </div>
      </div>
    </div>
  );
}