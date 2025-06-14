import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PageHero } from '../components/PageHero';

export function Services() {
  const services = [
    {
      title: "Sunday Worship Service",
      time: "10:00 AM - 12:00 PM",
      day: "Every Sunday",
      location: "Main Sanctuary",
      description: "Join us for powerful worship, biblical teaching, and community fellowship.",
      type: "weekly"
    },
    {
      title: "Wednesday Bible Study",
      time: "7:00 PM - 8:30 PM", 
      day: "Every Wednesday",
      location: "Fellowship Hall",
      description: "Deep dive into scripture with interactive discussion and prayer.",
      type: "weekly"
    },
    {
      title: "Friday Prayer Night",
      time: "6:00 PM - 8:00 PM",
      day: "Every Friday",
      location: "Prayer Room",
      description: "Intercessory prayer, healing ministry, and spiritual warfare.",
      type: "weekly"
    },
    {
      title: "Community Outreach",
      time: "9:00 AM - 3:00 PM",
      day: "First Saturday",
      location: "Various Locations",
      description: "Feeding the homeless, community cleanup, and street ministry.",
      type: "monthly"
    }
  ];

  const upcomingEvents = [
    {
      title: "Kingdom Conference 2025",
      date: "March 15-17, 2025",
      description: "Three days of powerful teaching, worship, and spiritual breakthrough.",
      featured: true
    },
    {
      title: "Youth Revival Night",
      date: "February 28, 2025",
      description: "Special service focused on reaching the next generation with the Gospel.",
      featured: false
    },
    {
      title: "Baptism Service",
      date: "March 3, 2025",
      description: "Public declaration of faith through water baptism.",
      featured: false
    }
  ];

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Worship Services & Events" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Regular Services */}
        <div className="relative mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-8 text-center">
            Regular Services
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 hover:border-amber-500/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-amber-500">{service.title}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    service.type === 'weekly' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    {service.type}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar size={16} className="text-amber-500" />
                    <span>{service.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock size={16} className="text-amber-500" />
                    <span>{service.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <MapPin size={16} className="text-amber-500" />
                    <span>{service.location}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{service.description}</p>
                
                <button className="flex items-center gap-2 text-amber-500 hover:text-amber-400 font-medium transition-colors">
                  Learn More
                  <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="relative mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-500 mb-8 text-center">
            Upcoming Events
          </h2>
          
          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`bg-black/60 backdrop-blur-sm border rounded-lg p-6 transition-all duration-300 hover:scale-105 ${
                  event.featured 
                    ? 'border-amber-500/50 bg-gradient-to-r from-amber-500/5 to-green-500/5' 
                    : 'border-green-500/30 hover:border-amber-500/50'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-amber-500">{event.title}</h3>
                      {event.featured && (
                        <span className="px-2 py-1 bg-amber-500 text-black text-xs font-bold rounded-full">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300 mb-2">
                      <Calendar size={16} className="text-amber-500" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <p className="text-gray-300">{event.description}</p>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-4 py-2 rounded-lg transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="relative bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-amber-500 mb-4">
            Join Us for Worship
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Experience the presence of God in our services. All are welcome to join our 
            community of believers as we worship, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Get Directions
            </Link>
            <Link
              to="/ministry"
              className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-6 py-3 rounded-lg transition-colors"
            >
              Learn About Our Ministry
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}