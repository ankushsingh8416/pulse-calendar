import { createFileRoute } from "@tanstack/react-router";
import { AppShell, useShell } from "@/components/layout/AppShell";
import { StatsGrid, ClockWidget } from "@/components/dashboard/StatsGrid";
import { UpcomingTimeline } from "@/components/dashboard/UpcomingTimeline";
import { FilterBar } from "@/components/dashboard/FilterBar";
import { CalendarMonth } from "@/components/calendar/CalendarMonth";
import { format } from "date-fns";
import { Plus, CalendarDays, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

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

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function Dashboard() {
  const shell = useShell();
  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="space-y-6 max-w-[1400px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="size-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">{today}</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight">
            {getGreeting()}, <span className="text-gradient">Ankush</span>
          </h1>
          <p className="text-muted-foreground mt-1">Here's what's on your schedule today.</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            onClick={() => shell.openNewEvent(format(new Date(), "yyyy-MM-dd"))}
            className="rounded-xl h-10 gap-2"
          >
            <CalendarDays className="size-4" />
            <span className="hidden sm:inline">Add today</span>
          </Button>
          <Button
            onClick={() => shell.openNewEvent()}
            className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-10 gap-2"
          >
            <Plus className="size-4" />
            <span>New Event</span>
          </Button>
        </div>
      </motion.div>

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
