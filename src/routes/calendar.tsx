import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/layout/AppShell";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { FilterBar } from "@/components/dashboard/FilterBar";

export const Route = createFileRoute("/calendar")({
  head: () => ({
    meta: [
      { title: "Calendar — Pulse" },
      { name: "description", content: "View and manage your events in a beautiful monthly calendar." },
    ],
  }),
  component: () => (
    <AppShell>
      <CalendarPage />
    </AppShell>
  ),
});

function CalendarPage() {
  const shell = useShell();
  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <div>
        <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground mt-1">Click any day to add an event.</p>
      </div>
      <FilterBar />
      <CalendarMonth
        onSelectDate={(iso) => shell.openNewEvent(iso)}
        onSelectEvent={(id) => shell.openEditEvent(id)}
      />
    </div>
  );
}
