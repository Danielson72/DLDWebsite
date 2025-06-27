export function Home() {
  return (
    <div className="relative h-screen flex items-stretch overflow-hidden">
      {/* Left Panel */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_left,black,transparent)]">
          <div className="absolute inset-0 animate-matrix-rain"></div>
        </div>
      </div>

      {/* Center Image Container */}
      <div className="flex-none w-full max-w-[300px] sm:max-w-[500px] md:max-w-[700px] lg:max-w-[900px] xl:max-w-[1200px] relative mx-auto">
        <div 
          className="absolute inset-0 bg-contain bg-center bg-no-repeat"
          style={{ backgroundImage: 'url("/ChatGPT Image Jun 5, 2025, 02_06_35 PM (1).png")' }}
        ></div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 relative bg-black">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px] [mask-image:linear-gradient(to_right,black,transparent)]">
          <div className="absolute inset-0 animate-matrix-rain"></div>
        </div>
      </div>
    </div>
  );
}