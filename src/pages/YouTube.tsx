import { Play, Users, Bell, ExternalLink, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export function YouTube() {
  const featuredVideos = [
    {
      title: "Kingdom Identity: Who You Really Are",
      description: "Discover your true identity in Christ and walk in the authority God has given you.",
      thumbnail: "https://images.pexels.com/photos/8923569/pexels-photo-8923569.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: "45:32",
      views: "12.5K",
      category: "Teaching"
    },
    {
      title: "Heavenly Vibin - Official Music Video",
      description: "Experience the divine frequencies that connect your spirit to heaven.",
      thumbnail: "https://images.pexels.com/photos/7991579/pexels-photo-7991579.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: "4:23",
      views: "8.2K",
      category: "Music"
    },
    {
      title: "Spiritual Warfare: Weapons of Our Warfare",
      description: "Learn to fight with spiritual weapons and overcome the enemy's attacks.",
      thumbnail: "https://images.pexels.com/photos/8923564/pexels-photo-8923564.jpeg?auto=compress&cs=tinysrgb&w=400",
      duration: "38:15",
      views: "15.7K",
      category: "Teaching"
    }
  ];

  const videoCategories = [
    {
      name: "Worship & Music",
      count: "25+ videos",
      description: "Original Kingdom music, worship sessions, and live performances",
      icon: "🎵"
    },
    {
      name: "Biblical Teaching",
      count: "40+ videos", 
      description: "Deep biblical insights, prophecy, and spiritual revelation",
      icon: "📖"
    },
    {
      name: "Prayer & Ministry",
      count: "30+ videos",
      description: "Prayer sessions, healing ministry, and spiritual guidance",
      icon: "🙏"
    },
    {
      name: "Testimonies",
      count: "15+ videos",
      description: "Real-life transformation stories and divine encounters",
      icon: "✨"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="YouTube Channel" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Channel Introduction */}
        <div className="relative text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-6">
            Daniel in the Lion's Den TV
          </h2>
          <p className="text-xl text-emerald-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Join Daniel Alvarez for powerful biblical teaching, Kingdom music, prayer sessions, 
            and spiritual insights that will transform your walk with the Most High.
          </p>
          
          {/* Channel Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-8">
            <div className="flex items-center gap-2 text-gray-300">
              <Users size={20} className="text-amber-500" />
              <span className="font-bold">2.3K Subscribers</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Play size={20} className="text-amber-500" />
              <span className="font-bold">150+ Videos</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <Bell size={20} className="text-amber-500" />
              <span className="font-bold">Weekly Uploads</span>
            </div>
          </div>

          {/* Subscribe Button */}
          <a
            href="https://www.youtube.com/@danielinthelionsden?si=Gbj-5bbBTDHS3mRD"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-4 rounded-lg transition-colors text-lg"
          >
            <i className="fab fa-youtube text-2xl"></i>
            Subscribe to Our Channel
            <ExternalLink size={20} />
          </a>
        </div>

        {/* Featured Videos */}
        <div className="relative mb-16">
          <h3 className="text-2xl font-bold text-amber-500 mb-8 text-center">
            Featured Content
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVideos.map((video, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg overflow-hidden hover:border-amber-500/50 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                {/* Thumbnail */}
                <div className="relative">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Play size={48} className="text-white" />
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
                    {video.duration}
                  </div>
                  <div className="absolute top-2 left-2 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded">
                    {video.category}
                  </div>
                </div>
                
                {/* Content */}
                <div className="p-4">
                  <h4 className="text-lg font-bold text-amber-500 mb-2 line-clamp-2">
                    {video.title}
                  </h4>
                  <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{video.views} views</span>
                    <button className="flex items-center gap-1 text-amber-500 hover:text-amber-400 transition-colors">
                      Watch Now
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Video Categories */}
        <div className="relative mb-16">
          <h3 className="text-2xl font-bold text-amber-500 mb-8 text-center">
            Content Categories
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {videoCategories.map((category, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{category.icon}</span>
                  <div>
                    <h4 className="text-xl font-bold text-amber-500">{category.name}</h4>
                    <span className="text-sm text-gray-400">{category.count}</span>
                  </div>
                </div>
                <p className="text-gray-300">{category.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="relative bg-gradient-to-r from-red-600/10 to-amber-500/10 border border-red-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-500 mb-4">
            Don't Miss Our Latest Content
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Subscribe and hit the notification bell to stay updated with our latest teachings, 
            music releases, and live streams. Join our growing community of believers!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://www.youtube.com/@danielinthelionsden?si=Gbj-5bbBTDHS3mRD"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
            >
              <i className="fab fa-youtube"></i>
              Visit Our Channel
            </a>
            <button className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-6 py-3 rounded-lg transition-colors">
              Enable Notifications
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}