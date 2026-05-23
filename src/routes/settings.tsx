import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { useTheme } from "@/hooks/useTheme";
import { useCalendarStore } from "@/store/useCalendarStore";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Monitor, Trash2 } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Pulse" },
      { name: "description", content: "Customize Pulse — appearance, categories, and data." },
    ],
  }),
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
              onClick={() => setTheme(opt.value as any)}
              className={`p-4 rounded-xl border transition-all ${theme === opt.value ? "border-primary shadow-glow" : "border-border hover:bg-accent"}`}
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
            <div key={c.id} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-background text-sm">
              <span className="size-2.5 rounded-full" style={{ background: c.color }} />
              {c.name}
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-card p-6 shadow-soft">
        <h2 className="font-semibold mb-1">Data</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {events.length} events stored locally in your browser.
        </p>
        <Button
          variant="outline"
          className="rounded-xl text-destructive"
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
      </section>
    </div>
  );
}
