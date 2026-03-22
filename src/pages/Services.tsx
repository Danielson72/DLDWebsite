import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';

export function Services() {
  const services = [
    {
      title: "Saturday Worship Service",
      time: "3:00 PM - 5:00 PM",
      day: "Every Saturday",
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
      title: "Kingdom Conference 2026",
      date: "March 15-17, 2026",
      description: "Three days of powerful teaching, worship, and spiritual breakthrough.",
      featured: true
    },
    {
      title: "Youth Revival Night",
      date: "February 28, 2026",
      description: "Special service focused on reaching the next generation with the Gospel.",
      featured: false
    },
    {
      title: "Baptism Service",
      date: "March 3, 2026",
      description: "Public declaration of faith through water baptism.",
      featured: false
    }
  ];

  return (
    <>
      <DLDNav />

      {/* Hero */}
      <section className="py-24 px-6 text-center" style={{ background: '#000e0f' }}>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4 font-manrope">
          Worship & Events
        </span>
        <h1 className="font-newsreader text-4xl md:text-5xl text-[#EEC14E] font-bold mb-4">
          Worship Services & Events
        </h1>
        <p className="text-dld-muted font-manrope max-w-md mx-auto">
          Gather with us to worship, learn, and grow in faith.
        </p>
      </section>

      <ScriptureBanner
        verse="Commit your work to the Lord, and your plans will succeed."
        reference="— Proverbs 16:3 (NLT)" />

      {/* Regular Services */}
      <section className="py-20 px-6" style={{ background: '#091f21' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] text-center mb-3 font-manrope">
            Weekly Schedule
          </span>
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold text-center mb-12">
            Regular Services
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-[#192d2f] border border-[#EEC14E]/20 rounded-lg p-6 hover:border-[#EEC14E]/40 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-newsreader text-xl font-bold text-[#EEC14E]">{service.title}</h3>
                  <span className={`px-3 py-1 text-[10px] uppercase tracking-wider rounded-full font-manrope font-bold ${
                    service.type === 'weekly'
                      ? 'bg-[#EEC14E]/10 text-[#EEC14E]'
                      : 'bg-[#DA920F]/10 text-[#DA920F]'
                  }`}>
                    {service.type}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-dld-muted font-manrope text-sm">
                    <Calendar size={16} className="text-[#EEC14E]" />
                    <span>{service.day}</span>
                  </div>
                  <div className="flex items-center gap-2 text-dld-muted font-manrope text-sm">
                    <Clock size={16} className="text-[#EEC14E]" />
                    <span>{service.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-dld-muted font-manrope text-sm">
                    <MapPin size={16} className="text-[#EEC14E]" />
                    <span>{service.location}</span>
                  </div>
                </div>

                <p className="text-dld-muted font-manrope text-sm mb-4">{service.description}</p>

                <button className="inline-flex items-center gap-2 text-[#EEC14E] hover:text-[#F7D97A] font-manrope font-bold text-xs uppercase tracking-widest transition-colors">
                  Learn More
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 px-6" style={{ background: '#001315' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] text-center mb-3 font-manrope">
            Mark Your Calendar
          </span>
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold text-center mb-12">
            Upcoming Events
          </h2>

          <div className="space-y-6">
            {upcomingEvents.map((event, index) => (
              <div
                key={index}
                className={`bg-[#192d2f] border rounded-lg p-6 transition-all duration-300 ${
                  event.featured
                    ? 'border-[#EEC14E]/40'
                    : 'border-[#EEC14E]/20 hover:border-[#EEC14E]/40'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-newsreader text-xl font-bold text-[#EEC14E]">{event.title}</h3>
                      {event.featured && (
                        <span className="px-3 py-1 bg-[#EEC14E] text-[#001315] text-[10px] font-manrope font-bold rounded-full uppercase tracking-wider">
                          FEATURED
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-dld-muted font-manrope text-sm mb-2">
                      <Calendar size={16} className="text-[#EEC14E]" />
                      <span className="font-medium">{event.date}</span>
                    </div>
                    <p className="text-dld-muted font-manrope text-sm">{event.description}</p>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6">
                    <button className="px-6 py-2.5 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-xs hover:bg-[#F7D97A] transition-colors">
                      Register Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center" style={{ background: '#091f21', borderTop: '1px solid rgba(238,193,78,0.15)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold mb-4">
            Join Us for Worship
          </h2>
          <p className="text-dld-muted font-manrope mb-8">
            Experience the presence of God in our services. All are welcome to join our
            community of believers as we worship, learn, and grow together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#F7D97A] transition-colors"
            >
              Get Directions
            </Link>
            <Link
              to="/ministry"
              className="inline-block px-8 py-4 border border-[#EEC14E]/30 text-[#EEC14E] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#EEC14E] hover:text-[#001315] transition-colors"
            >
              Learn About Our Ministry
            </Link>
          </div>
        </div>
      </section>

      <DLDFooter />
    </>
  );
}