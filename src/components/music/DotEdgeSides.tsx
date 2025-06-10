export function DotEdgeSides() {
  return (
    <>
      <div className="fixed inset-y-0 left-0 w-[12%] sm:w-[10%] md:w-[8%] lg:w-[6%] xl:w-[5%] bg-black/90 bg-[radial-gradient(circle,rgba(0,255,120,0.5)_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none z-20" />
      <div className="fixed inset-y-0 right-0 w-[12%] sm:w-[10%] md:w-[8%] lg:w-[6%] xl:w-[5%] bg-black/90 bg-[radial-gradient(circle,rgba(0,255,120,0.5)_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none z-20" />
      <div className="fixed bottom-0 inset-x-0 h-[60px] bg-black/90 bg-[radial-gradient(circle,rgba(0,255,120,0.5)_1px,transparent_1px)] [background-size:6px_6px] pointer-events-none z-20" />
    </>
  );
}