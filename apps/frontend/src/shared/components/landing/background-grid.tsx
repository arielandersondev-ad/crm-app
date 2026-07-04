export function BackgroundGrid() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <span className="pixel absolute left-[8%] top-[50%] h-10 w-10 bg-white/5" />
      <span className="pixel absolute left-[18%] top-[20%] h-8 w-8 bg-white/5" />
      <span className="pixel right-[14%] top-[36%] h-10 w-10 bg-white/6" />
      <span className="pixel right-[32%] top-[10%] h-8 w-8 bg-white/5" />
      <span className="pixel left-[42%] top-[58%] h-10 w-10 bg-white/5" />

      <span className="pixel absolute left-[28%] top-[60%] h-10 w-10 bg-white/5" />
      <span className="pixel absolute left-[58%] top-[30%] h-8 w-8 bg-white/5" />
      <span className="pixel right-[14%] top-[46%] h-10 w-10 bg-white/6" />
      <span className="pixel right-[32%] top-[20%] h-8 w-8 bg-white/5" />
      <span className="pixel left-[42%] top-[68%] h-10 w-10 bg-white/5" />
    </div>
  );
}