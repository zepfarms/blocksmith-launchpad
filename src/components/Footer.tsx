export const Footer = () => {
  return (
    <footer className="py-12 px-4 border-t border-border/50">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold gradient-text">SpaceBlocks.ai</h3>
            <p className="text-sm text-muted-foreground">The Business Builder Marketplace</p>
          </div>

          <div className="text-sm text-muted-foreground text-center md:text-right">
            <p>The future isn't "Do-It-Yourself."</p>
            <p className="font-semibold">It's Build-It-With-AI.</p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 SpaceBlocks.ai. Launch tomorrow, not someday.</p>
        </div>
      </div>
    </footer>
  );
};
