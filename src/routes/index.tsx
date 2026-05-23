import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/layout/AppShell";
import { StatsGrid, ClockWidget } from "@/components/dashboard/StatsGrid";
import { UpcomingTimeline } from "@/components/dashboard/UpcomingTimeline";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pulse — Premium event calendar & reminders" },
      { name: "description", content: "A premium, beautifully designed event calendar and reminder app. Plan your days with style — all stored locally in your browser." },
      { property: "og:title", content: "Pulse — Premium event calendar" },
      { property: "og:description", content: "Plan events, set reminders, and stay on top of your schedule with a stunning local-first calendar." },
    ],
  }),
  component: () => (
    <AppShell>
      <Dashboard />
    </AppShell>
  ),
});

function Dashboard() {
  const shell = useShell();
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
          Welcome back <span className="text-gradient">to Pulse</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's coming up.</p>
      </div>
      <StatsGrid />
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 space-y-4">
          <FilterBar />
          <CalendarMonth
            onSelectDate={(iso) => shell.openNewEvent(iso)}
            onSelectEvent={(id) => shell.openEditEvent(id)}
          />
        </div>
        <div className="space-y-4">
          <ClockWidget />
          <UpcomingTimeline onSelect={(id) => shell.openEditEvent(id)} />
        </div>
      </div>
    </div>
  );
}
