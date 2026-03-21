interface ScriptureBannerProps {
  verse: string;
  reference: string;
}

export function ScriptureBanner({ verse, reference }: ScriptureBannerProps) {
  return (
    <div
      className="py-10 px-6"
      style={{
        backgroundColor: '#091f21',
        borderTop: '1px solid rgba(238,193,78,0.20)',
        borderBottom: '1px solid rgba(238,193,78,0.20)',
      }}
    >
      <blockquote className="max-w-2xl mx-auto text-center font-newsreader italic text-lg text-[#EEC14E]">
        {verse}
        <span className="block mt-2 text-sm opacity-60">{reference}</span>
      </blockquote>
    </div>
  );
}
