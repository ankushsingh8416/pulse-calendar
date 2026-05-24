import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/layout/AppShell";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";

export const Route = createFileRoute("/calendar")({
  component: () => (
    <AppShell>
      <CalendarPage />
    </AppShell>
  ),
});

function CalendarPage() {
  const shell = useShell();
  return (
    <div className="space-y-6 max-w-350 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="size-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{format(new Date(), "MMMM yyyy")}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">Calendar</h1>
          <p className="text-muted-foreground mt-1">Click any day to add an event.</p>
        </div>
      </div>
      <FilterBar />
      <CalendarMonth
        onSelectDate={(iso) => shell.openNewEvent(iso)}
        onSelectEvent={(id) => shell.openEditEvent(id)}
      />
    </div>
  );
}
