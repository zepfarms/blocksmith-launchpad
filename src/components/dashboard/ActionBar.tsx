import { Button } from "@/components/ui/button";

interface ActionBarProps {
  selectedCount: number;
  onSaveSelected: () => void;
  disabled: boolean;
}

export function ActionBar({ selectedCount, onSaveSelected, disabled }: ActionBarProps) {
  return (
    <div className="sticky bottom-24 left-0 right-0 z-40">
      <div className="max-w-6xl mx-auto px-4">
        <div className="glass-card p-4 rounded-full border border-white/20 flex items-center justify-center">
          <Button
            onClick={onSaveSelected}
            disabled={selectedCount === 0 || disabled}
            size="lg"
            className="rounded-full px-8"
          >
            Save Selected ({selectedCount})
          </Button>
        </div>
      </div>
    </div>
  );
}