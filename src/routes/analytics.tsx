import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Analytics } from "@/components/analytics/Analytics";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics — Pulse" },
      { name: "description", content: "Visualize your event activity, completion rate, and category breakdown." },
    ],
  }),
  component: () => (
    <AppShell>
      <div className="space-y-6 max-w-[1400px] mx-auto">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-1">Insights from your schedule.</p>
        </div>
        <Analytics />
      </div>
    </AppShell>
  ),
});
