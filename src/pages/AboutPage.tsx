import { DLDNav } from '../components/layout/DLDNav';
import { DLDFooter } from '../components/layout/DLDFooter';

const sections = [
  {
    title: 'Who I Am',
    body: (
      <>
        Daniel Alvarez is a family man, music artist, business entrepreneur, and visionary from Orlando, Florida.
        Of Puerto Rican heritage, Daniel walks in reverence to The Most High Almighty. He is the
        founder of <em className="text-dld-text">Sonz of Thunder SVC</em>, a cleaning company with a mission to serve both spiritually and
        professionally. He is also a website builder, content creator, and digital innovator.
      </>
    ),
  },
  {
    title: 'Kingdom Identity',
    body: (
      <>
        Daniel believes in the divine calling to bring transformation. He teaches, prays, ministers, and leads
        outreach that cleans up communities, feeds the homeless, and uplifts the lost. He operates in faith
        and wisdom — representing a modern-day voice crying out in the digital wilderness.
      </>
    ),
  },
  {
    title: 'Music & Message',
    body: (
      <>
        Performing as <em className="text-dld-text">Daniel in the Lion's Den</em> (DLD), he produces Christ-centered hip-hop, rock, reggae,
        and fusion tracks. His music speaks to identity, warfare, restoration, and purpose. He uses sound as a
        weapon and worship as a strategy — all to glorify the Most High.
      </>
    ),
  },
  {
    title: 'Entrepreneurship',
    body: (
      <>
        Through <em className="text-dld-text">Sonz of Thunder Services</em>, Daniel runs a growing commercial and residential cleaning
        business across Central Florida. He also builds professional websites for businesses, brands, and
        ministries, using AI and automation tools to amplify kingdom impact.
      </>
    ),
  },
  {
    title: 'Transformer (WIP)',
    body: (
      <>
        Daniel is writing a transformational book titled <em className="text-dld-text">"Transformer: Transform Into Who God Calls You to Be"</em>.
        The book weaves biblical truths with personal testimony, mindset renewal, spiritual identity, and leadership.
        It incorporates tools like the Decision Matrix, teachings on the Melchizedek priesthood, brainwave states,
        breathwork, and divine healing. It will serve as a guide for the remnant generation rising in this digital age.
      </>
    ),
  },
];

export function AboutPage() {
  return (
    <>
      <DLDNav />

      {/* HERO */}
      <section className="py-24 px-6 text-center" style={{ backgroundColor: '#000e0f' }}>
        <div className="max-w-2xl mx-auto">
          <h1 className="font-newsreader text-4xl md:text-5xl text-[#EEC14E] font-bold mb-4">
            About Daniel Alvarez
          </h1>
          <p className="text-dld-muted text-lg font-manrope">
            Family man. Music artist. Entrepreneur. Kingdom builder.
          </p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="py-20 px-6" style={{ backgroundColor: '#001315' }}>
        <div className="max-w-4xl mx-auto space-y-6">
          {sections.map((section, i) => (
            <div
              key={i}
              className="bg-[#192d2f] rounded-xl p-8 border border-[#EEC14E]/20"
            >
              <h2 className="font-newsreader text-2xl text-[#EEC14E] font-bold mb-4">
                {section.title}
              </h2>
              <p className="font-manrope text-sm text-dld-muted leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <DLDFooter />
    </>
  );
}
