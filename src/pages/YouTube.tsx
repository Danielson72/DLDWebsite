import { Play, ExternalLink } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export function YouTube() {
  const featuredVideos = [
    {
      id: 'M8c7JlutBd8',
      title: 'Elite Vocal Chain',
      description: 'Professional vocal processing techniques and chain setup for studio-quality recordings.',
      url: 'https://youtu.be/M8c7JlutBd8?si=oW9eeaUgqRqDSOAo',
      thumbnail: `https://img.youtube.com/vi/M8c7JlutBd8/maxresdefault.jpg`
    },
    {
      id: 'WD70IBOCwcU',
      title: 'Microphone Shootout',
      description: 'Comprehensive comparison of professional microphones for recording and live performance.',
      url: 'https://youtu.be/WD70IBOCwcU?si=sOC34LzV2IN8Q0JL',
      thumbnail: `https://img.youtube.com/vi/WD70IBOCwcU/maxresdefault.jpg`
    },
    {
      id: 'led58tzh_CU',
      title: 'Relationships and God',
      description: 'Spiritual guidance on building meaningful relationships through faith and divine purpose.',
      url: 'https://youtu.be/led58tzh_CU?si=VzU9vG5zkhrwpL3n',
      thumbnail: `https://img.youtube.com/vi/led58tzh_CU/maxresdefault.jpg`
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="YouTube Channel" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative">
          {/* Channel Introduction */}
          <div className="text-center mb-16">
            <div className="flex justify-center mb-6">
              <Play size={48} className="text-amber-500 filter drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-4">
              Welcome to the Lion's Den
            </h2>
            <p className="text-xl text-emerald-400 max-w-3xl mx-auto leading-relaxed">
              Join Daniel Alvarez on a journey of faith, music, and transformation. Our YouTube channel features 
              original music, spiritual teachings, technical tutorials, and behind-the-scenes content from the ministry.
            </p>
          </div>

          {/* Featured Content Section */}
          <div className="mb-16">
            <h3 className="text-2xl font-bold text-amber-500 mb-8 text-center">Featured Content</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredVideos.map((video, index) => (
                <div
                  key={video.id}
                  className="group relative bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
                >
                  {/* Video Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        // Fallback to default thumbnail if maxresdefault doesn't exist
                        e.currentTarget.src = `https://img.youtube.com/vi/${video.id}/hqdefault.jpg`;
                      }}
                    />
                    
                    {/* Play Overlay */}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-amber-500 rounded-full p-4 transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <Play size={24} className="text-black ml-1" fill="currentColor" />
                      </div>
                    </div>
                    
                    {/* Video Number Badge */}
                    <div className="absolute top-3 left-3 bg-amber-500 text-black font-bold text-sm px-2 py-1 rounded">
                      #{index + 1}
                    </div>
                  </div>

                  {/* Video Info */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-amber-500 mb-3 group-hover:text-amber-400 transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-green-200/80 text-sm leading-relaxed mb-4">
                      {video.description}
                    </p>
                    
                    {/* Watch Button */}
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors group/btn"
                    >
                      <ExternalLink size={16} className="group-hover/btn:scale-110 transition-transform" />
                      Watch on YouTube
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Channel Stats & Call to Action */}
          <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 text-center">
            <h3 className="text-2xl font-bold text-amber-500 mb-4">Join Our Community</h3>
            <p className="text-green-200/80 mb-6 max-w-2xl mx-auto">
              Subscribe to our YouTube channel for the latest music releases, spiritual teachings, 
              and behind-the-scenes content. Be part of the Lion's Den family and stay connected 
              with our ministry's journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a
                href="https://youtube.com/@danielinthelionsden"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors transform hover:scale-105"
              >
                <Play size={20} fill="currentColor" />
                Subscribe on YouTube
              </a>
              
              <div className="flex items-center gap-6 text-sm text-green-200/60">
                <div className="text-center">
                  <div className="font-bold text-amber-500">50+</div>
                  <div>Videos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-500">1K+</div>
                  <div>Subscribers</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-amber-500">10K+</div>
                  <div>Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Categories */}
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-amber-500 mb-8 text-center">What You'll Find</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: 'Original Music',
                  description: 'Christ-centered hip-hop, rock, reggae, and fusion tracks',
                  icon: '🎵'
                },
                {
                  title: 'Spiritual Teaching',
                  description: 'Biblical truths, identity, and kingdom principles',
                  icon: '📖'
                },
                {
                  title: 'Technical Tutorials',
                  description: 'Music production, recording, and audio engineering',
                  icon: '🎛️'
                },
                {
                  title: 'Behind the Scenes',
                  description: 'Studio sessions, ministry work, and personal journey',
                  icon: '🎬'
                }
              ].map((category, index) => (
                <div
                  key={index}
                  className="bg-black/40 border border-green-500/20 rounded-lg p-6 text-center hover:border-amber-500/30 transition-colors"
                >
                  <div className="text-3xl mb-3">{category.icon}</div>
                  <h4 className="text-lg font-bold text-amber-500 mb-2">{category.title}</h4>
                  <p className="text-green-200/70 text-sm">{category.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}