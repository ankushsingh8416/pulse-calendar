import { Heart, Sparkles } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden lg:flex items-center justify-between px-8 py-3 border-t border-border bg-card/40 text-xs text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <Sparkles className="size-3 text-primary" />
        <span className="font-medium text-foreground">Pulse Calendar</span>
        <span>· v1.0.0</span>
      </div>
      <div className="flex items-center gap-1.5">
        Made with <Heart className="size-3 text-destructive fill-destructive mx-0.5" /> by
        <span className="font-semibold text-foreground ml-0.5">Ankush</span>
        <span className="mx-1">·</span>
        <span>All data stored locally in your browser</span>
      </div>
      <div className="flex items-center gap-1">
        <span>Built with React 19 · TanStack · Tailwind CSS v4</span>
      </div>
    </footer>
  );
}
