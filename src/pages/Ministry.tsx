import { Heart, Users, BookOpen, SprayCan as Pray, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';
import { ScriptureBanner } from '../components/ui/ScriptureBanner';

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
    <>
      <DLDNav />

      {/* Hero */}
      <section className="py-24 px-6 text-center" style={{ background: '#000e0f' }}>
        <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] mb-4 font-manrope">
          Our Ministry
        </span>
        <h1 className="font-newsreader text-4xl md:text-5xl text-[#EEC14E] font-bold mb-4">
          Called to Transform Lives
        </h1>
        <p className="text-dld-muted font-manrope max-w-2xl mx-auto leading-relaxed">
          Daniel in the Lion's Den Ministry operates in faith and wisdom, bringing transformation
          through teaching, prayer, and community outreach. We represent a modern-day voice
          crying out in the digital wilderness.
        </p>
      </section>

      <ScriptureBanner
        verse="Religion that God our Father accepts as pure and faultless is this: to look after orphans and widows in their distress."
        reference="— James 1:27 (NIV)" />

      {/* Ministry Programs */}
      <section className="py-20 px-6" style={{ background: '#091f21' }}>
        <div className="max-w-5xl mx-auto">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-[#EEC14E] text-center mb-3 font-manrope">
            What We Do
          </span>
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold text-center mb-12">
            Ministry Programs
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {ministryPrograms.map((program, index) => (
              <div
                key={index}
                className="bg-[#192d2f] border border-[#EEC14E]/20 rounded-lg p-8 hover:border-[#EEC14E]/40 transition-all duration-300"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-[#EEC14E]/10 rounded-full">
                    <program.icon size={32} className="text-[#EEC14E]" />
                  </div>
                  <h3 className="font-newsreader text-xl font-bold text-[#EEC14E]">{program.title}</h3>
                </div>
                <p className="text-dld-muted font-manrope mb-6 leading-relaxed">{program.description}</p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-xs hover:bg-[#F7D97A] transition-colors">
                  {program.action}
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 text-center" style={{ background: '#091f21', borderTop: '1px solid rgba(238,193,78,0.15)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="font-newsreader text-3xl text-[#EEC14E] font-bold mb-4">
            Ready to Join Our Ministry?
          </h2>
          <p className="text-dld-muted font-manrope mb-8">
            Whether you're seeking spiritual guidance, want to volunteer, or need prayer,
            we're here to walk alongside you in your faith journey.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/contact"
              className="inline-block px-8 py-4 bg-[#EEC14E] text-[#001315] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#F7D97A] transition-colors"
            >
              Get Involved Today
            </Link>
            <Link
              to="/services"
              className="inline-block px-8 py-4 border border-[#EEC14E]/30 text-[#EEC14E] font-manrope font-bold rounded-full uppercase tracking-widest text-sm hover:bg-[#EEC14E] hover:text-[#001315] transition-colors"
            >
              View Service Schedule
            </Link>
          </div>
        </div>
      </section>

      <DLDFooter />
    </>
  );
}