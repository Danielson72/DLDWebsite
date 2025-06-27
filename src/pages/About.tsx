import { Mic } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export function About() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-900/20 to-black overflow-x-hidden">
      <PageHero title="About Daniel Alvarez" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Microphone Icon */}
        <div className="flex justify-center mb-12 sm:mb-16">
          <div className="relative">
            <Mic size={48} className="sm:size-16 text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            <div className="absolute inset-0 animate-pulse bg-amber-500/20 rounded-full blur-xl"></div>
          </div>
        </div>

        {/* Connected Blocks Layout */}
        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Who I Am Block */}
          <div className="relative p-6 sm:p-8 rounded-lg border-2 border-green-500/50 shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:scale-105 transition-all duration-300 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4 sm:mb-6">Who I Am</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Daniel Alvarez is a family man, music artist, business entrepreneur, and visionary from Orlando, Florida. 
              Of Puerto Rican heritage, Daniel walks in reverence to The Most High Almighty. He is the 
              founder of <em>Sonz of Thunder SVC</em>, a cleaning company with a mission to serve both spiritually and 
              professionally. He is also a website builder, content creator, and digital innovator.
            </p>
            <div className="absolute -right-3 sm:-right-6 top-1/2 w-6 sm:w-12 h-1 bg-gradient-to-r from-green-500 to-transparent lg:block hidden"></div>
          </div>

          {/* Kingdom Identity Block */}
          <div className="relative p-6 sm:p-8 rounded-lg border-2 border-green-500/50 shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:scale-105 transition-all duration-300 bg-black/60 backdrop-blur-sm">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4 sm:mb-6">Kingdom Identity</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Daniel believes in the divine calling to bring transformation. He teaches, prays, ministers, and leads 
              outreach that cleans up communities, feeds the homeless, and uplifts the lost. He operates in faith 
              and wisdom — representing a modern-day voice crying out in the digital wilderness.
            </p>
            <div className="absolute left-1/2 -bottom-3 sm:-bottom-6 w-1 h-6 sm:h-12 bg-gradient-to-b from-green-500 to-transparent"></div>
          </div>

          {/* Music & Message Block */}
          <div className="relative p-6 sm:p-8 rounded-lg border-2 border-green-500/50 shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:scale-105 transition-all duration-300 bg-black/60 backdrop-blur-sm lg:col-span-2 lg:w-2/3 mx-auto">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4 sm:mb-6">Music & Message</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Performing as <em>Daniel in the Lion's Den</em> (DLD), he produces Christ-centered hip-hop, rock, reggae, 
              and fusion tracks. His music speaks to identity, warfare, restoration, and purpose. He uses sound as a 
              weapon and worship as a strategy — all to glorify the Most High.
            </p>
            <div className="absolute left-1/2 -bottom-3 sm:-bottom-6 w-1 h-6 sm:h-12 bg-gradient-to-b from-green-500 to-transparent"></div>
          </div>

          {/* Entrepreneurship Block */}
          <div className="relative p-6 sm:p-8 rounded-lg border-2 border-green-500/50 shadow-[0_0_15px_rgba(0,255,0,0.2)] hover:scale-105 transition-all duration-300 bg-black/60 backdrop-blur-sm lg:col-span-2 lg:w-2/3 mx-auto">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <h2 className="responsive-heading-lg font-bold text-amber-500 mb-4 sm:mb-6">Entrepreneurship</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Through <em>Sonz of Thunder Services</em>, Daniel runs a growing commercial and residential cleaning 
              business across Central Florida. He also builds professional websites for businesses, brands, and 
              ministries, using AI and automation tools to amplify kingdom impact.
            </p>
            <div className="absolute left-1/2 -bottom-3 sm:-bottom-6 w-1 h-6 sm:h-12 bg-gradient-to-b from-green-500 to-transparent"></div>
          </div>

          {/* Transformer Block */}
          <div className="relative p-6 sm:p-8 rounded-lg border-2 border-gradient-gold-silver shadow-[0_0_15px_rgba(255,215,0,0.2)] hover:scale-105 transition-all duration-300 bg-black/60 backdrop-blur-sm lg:col-span-2 lg:w-2/3 mx-auto">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-gray-300/5"></div>
            <h2 className="responsive-heading-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-gray-300 mb-4 sm:mb-6">Transformer (WIP)</h2>
            <p className="text-gray-300 leading-relaxed text-sm sm:text-base">
              Daniel is writing a transformational book titled <em>Transformer: Transform Into Who God Calls You to Be</em>. 
              The book weaves biblical truths with personal testimony, mindset renewal, spiritual identity, and leadership. 
              It incorporates tools like the Decision Matrix, teachings on the Melchizedek priesthood, brainwave states, 
              breathwork, and divine healing. It will serve as a guide for the remnant generation rising in this digital age.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}