export function AnimatedBackground({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-base-gradient relative min-h-screen overflow-hidden flex flex-col items-center">
      <div className="absolute inset-0 pattern-auto-dots pointer-events-none" />
      <div className="absolute inset-0 pattern-auto-grid pointer-events-none" />
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
