import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { Analytics } from "@/components/analytics/Analytics";
import { BarChart3 } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/analytics")({
  component: () => (
    <AppShell>
      <AnalyticsPage />
    </AppShell>
  ),
});

function AnalyticsPage() {
  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="size-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">
            Overview · {format(new Date(), "MMMM yyyy")}
          </span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground mt-1">Insights and trends from your schedule.</p>
      </div>
      <Analytics />
    </div>
  );
}
