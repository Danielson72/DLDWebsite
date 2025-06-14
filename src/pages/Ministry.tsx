import { Heart, Users, BookOpen, SprayCan as Pray, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

export function Ministry() {
  const ministryPrograms = [
    {
      icon: Heart,
      title: "Community Outreach",
      description: "Feeding the homeless, cleaning communities, and bringing hope to those in need.",
      action: "Join Our Mission"
    },
    {
      icon: Users,
      title: "Spiritual Guidance",
      description: "One-on-one counseling, prayer sessions, and biblical teaching for personal growth.",
      action: "Request Guidance"
    },
    {
      icon: BookOpen,
      title: "Bible Study Groups",
      description: "Weekly gatherings to dive deep into scripture and strengthen faith together.",
      action: "Find a Group"
    },
    {
      icon: Pray,
      title: "Prayer Ministry",
      description: "Intercessory prayer, healing services, and spiritual warfare training.",
      action: "Submit Prayer Request"
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Our Ministry" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Mission Statement */}
        <div className="relative text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-6">
            Called to Transform Lives
          </h2>
          <p className="text-xl text-emerald-400 max-w-3xl mx-auto leading-relaxed">
            Daniel in the Lion's Den Ministry operates in faith and wisdom, bringing transformation 
            through teaching, prayer, and community outreach. We represent a modern-day voice 
            crying out in the digital wilderness.
          </p>
        </div>

        {/* Ministry Programs Grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {ministryPrograms.map((program, index) => (
            <div
              key={index}
              className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-8 hover:border-amber-500/50 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-amber-500/20 rounded-full">
                  <program.icon size={32} className="text-amber-500" />
                </div>
                <h3 className="text-2xl font-bold text-amber-500">{program.title}</h3>
              </div>
              <p className="text-gray-300 mb-6 leading-relaxed">{program.description}</p>
              <button className="flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-medium px-4 py-2 rounded-lg transition-colors">
                {program.action}
                <ArrowRight size={16} />
              </button>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="relative bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-500 mb-4">
            Ready to Join Our Ministry?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Whether you're seeking spiritual guidance, want to volunteer, or need prayer, 
            we're here to walk alongside you in your faith journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Get Involved Today
            </Link>
            <Link
              to="/services"
              className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-6 py-3 rounded-lg transition-colors"
            >
              View Service Schedule
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}