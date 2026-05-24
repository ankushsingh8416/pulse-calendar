import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useTheme } from "@/hooks/useTheme";
import { useCalendarStore } from "@/store/useCalendarStore";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Trash2, Code2, Sparkles, Heart } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  component: () => (
    <AppShell>
      <Settings />
    </AppShell>
  ),
});

function Settings() {
  const { theme, setTheme } = useTheme();
  const { categories, events } = useCalendarStore();

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Personalize your experience.</p>
      </div>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold mb-1">Appearance</h2>
        <p className="text-sm text-muted-foreground mb-4">Choose how Pulse looks.</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: "light", label: "Light", icon: Sun },
            { value: "dark", label: "Dark", icon: Moon },
            { value: "system", label: "System", icon: Monitor },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTheme(opt.value as "light" | "dark" | "system")}
              className={`p-4 rounded-xl border transition-all text-center ${theme === opt.value ? "border-primary shadow-glow" : "border-border hover:bg-accent"}`}
            >
              <opt.icon className="size-5 mx-auto mb-2" />
              <div className="text-sm font-medium">{opt.label}</div>
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold mb-1">Categories</h2>
        <p className="text-sm text-muted-foreground mb-4">Color-coded labels for your events.</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((c) => (
            <div
              key={c.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background text-sm"
            >
              <span className="size-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold mb-1">Data</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {events.length} events stored locally in your browser. No server, no cloud.
        </p>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="rounded-xl text-destructive hover:bg-destructive/10"
            onClick={() => {
              if (confirm("Delete all events? This cannot be undone.")) {
                localStorage.removeItem("calendar-app-state");
                toast.success("All data cleared. Reloading…");
                setTimeout(() => location.reload(), 800);
              }
            }}
          >
            <Trash2 className="size-4 mr-2" /> Clear all data
          </Button>
          <span className="text-xs text-muted-foreground">This will permanently delete all your events.</span>
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold mb-1">About</h2>
        <p className="text-sm text-muted-foreground mb-5">About this application.</p>
        <div className="flex items-start gap-4">
          <div className="size-14 rounded-2xl gradient-primary grid place-items-center shadow-glow shrink-0">
            <Sparkles className="size-6 text-primary-foreground" />
          </div>
          <div className="space-y-1">
            <div className="font-bold text-lg">Pulse Calendar</div>
            <div className="text-sm text-muted-foreground">Version 1.0.0 · 2026</div>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2 max-w-md">
              A premium, beautifully designed event calendar and reminder app. Plan your days with
              style — all stored locally in your browser. No account needed.
            </p>
          </div>
        </div>
        <div className="mt-5 pt-5 border-t border-border flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-xl gradient-primary grid place-items-center shadow-glow">
              <Code2 className="size-4 text-primary-foreground" />
            </div>
            <div>
              <div className="text-sm font-semibold flex items-center gap-1.5">
                Made with <Heart className="size-3.5 text-destructive fill-destructive" /> by Ankush
              </div>
              <div className="text-xs text-muted-foreground">Built with React, TanStack, and Tailwind CSS</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="px-2 py-1 rounded-lg bg-muted font-mono">React 19</span>
            <span className="px-2 py-1 rounded-lg bg-muted font-mono">TanStack</span>
            <span className="px-2 py-1 rounded-lg bg-muted font-mono">Tailwind v4</span>
          </div>
        </div>
      </section>
    </div>
  );
}
