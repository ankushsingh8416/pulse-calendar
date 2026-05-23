import { useEffect, useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { CalendarDays, CheckCircle2, Clock, Bell } from "lucide-react";
import { useCalendarStore } from "@/store/useCalendarStore";

const stats = [
  { key: "total", label: "Total events", icon: CalendarDays, accent: "from-violet-500 to-fuchsia-500" },
  { key: "upcoming", label: "Upcoming", icon: Clock, accent: "from-blue-500 to-cyan-500" },
  { key: "completed", label: "Completed", icon: CheckCircle2, accent: "from-emerald-500 to-teal-500" },
  { key: "today", label: "Today's reminders", icon: Bell, accent: "from-amber-500 to-orange-500" },
] as const;

export function StatsGrid() {
  const events = useCalendarStore((s) => s.events);
  const today = format(new Date(), "yyyy-MM-dd");
  const values = {
    total: events.length,
    upcoming: events.filter((e) => e.date >= today && !e.completed).length,
    completed: events.filter((e) => e.completed).length,
    today: events.filter((e) => e.date === today && e.reminder > 0).length,
  };

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, i) => (
        <motion.div
          key={s.key}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft"
        >
          <div className={`absolute -top-8 -right-8 size-32 rounded-full bg-gradient-to-br ${s.accent} opacity-20 blur-2xl`} />
          <s.icon className="size-5 text-muted-foreground mb-3" />
          <div className="text-3xl font-bold tracking-tight">{values[s.key]}</div>
          <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft relative overflow-hidden">
      <div className="absolute inset-0 gradient-primary opacity-10" />
      <div className="relative">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Now</p>
        <p className="text-4xl font-bold tabular-nums mt-1">{format(now, "HH:mm:ss")}</p>
        <p className="text-sm text-muted-foreground mt-1">{format(now, "EEEE, MMMM d, yyyy")}</p>
      </div>
    </div>
  );
}
