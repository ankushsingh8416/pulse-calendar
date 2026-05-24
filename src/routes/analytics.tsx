import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Analytics } from "@/components/analytics/Analytics";
import { BarChart3 } from "lucide-react";
import { format } from "date-fns";

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
        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart3 className="size-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Overview · {format(new Date(), "MMMM yyyy")}</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
              Analytics
            </h1>
            <p className="text-muted-foreground mt-1">Insights and trends from your schedule.</p>
          </div>
        </div>
        <Analytics />
      </div>
    </AppShell>
  ),
});
