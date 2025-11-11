export const Footer = () => {
  return (
    <footer className="relative py-20 px-6 border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-4xl font-black tracking-tighter bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
              SpaceBlocks
            </h3>
            <p className="text-sm text-muted-foreground font-light tracking-wide">
              THE EMPIRE BUILDER OS
            </p>
          </div>

          <div className="text-center md:text-right space-y-3">
            <p className="text-lg text-foreground/80 font-light">
              The future isn't "Do-It-Yourself"
            </p>
            <p className="text-2xl font-bold bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
              It's Build-With-Intelligence
            </p>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground/60 font-light">
            &copy; 2025 SpaceBlocks.ai — Launch tomorrow, not someday.
          </p>
          
          <div className="flex items-center gap-3">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-neon-cyan/30" />
            <div className="w-2 h-2 rounded-full bg-neon-cyan animate-glow-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-neon-cyan/30" />
          </div>
        </div>
      </div>
    </footer>
  );
};
