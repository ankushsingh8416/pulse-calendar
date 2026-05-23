import { useMemo } from "react";
import { format, isToday, isTomorrow, parseISO } from "date-fns";
import { motion } from "framer-motion";
import { MapPin, Clock } from "lucide-react";
import { useCalendarStore } from "@/store/useCalendarStore";
import { cn } from "@/lib/utils";

export function UpcomingTimeline({ onSelect }: { onSelect: (id: string) => void }) {
  const events = useCalendarStore((s) => s.events);
  const categories = useCalendarStore((s) => s.categories);

  const items = useMemo(() => {
    const today = format(new Date(), "yyyy-MM-dd");
    return events
      .filter((e) => e.date >= today)
      .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))
      .slice(0, 8);
  }, [events]);

  const colorFor = (catId: string, override?: string) =>
    override || categories.find((c) => c.id === catId)?.color || "#8b5cf6";

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Upcoming</h3>
        <span className="text-xs text-muted-foreground">{items.length} events</span>
      </div>
      {items.length === 0 ? (
        <div className="py-10 text-center text-sm text-muted-foreground">
          <div className="mx-auto mb-3 size-12 rounded-full gradient-primary opacity-30" />
          Nothing on the horizon. Add an event to get started.
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((e, i) => {
            const d = parseISO(e.date);
            const label = isToday(d) ? "Today" : isTomorrow(d) ? "Tomorrow" : format(d, "EEE, MMM d");
            const color = colorFor(e.categoryId, e.color);
            return (
              <motion.button
                key={e.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                onClick={() => onSelect(e.id)}
                className="w-full text-left group flex items-center gap-3 p-3 rounded-xl hover:bg-accent/50 transition-colors"
              >
                <div className="w-1 self-stretch rounded-full" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className={cn("font-medium truncate", e.completed && "line-through opacity-60")}>{e.title}</p>
                    {e.priority === "high" && (
                      <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-destructive/10 text-destructive">High</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5">
                    <span>{label}</span>
                    {e.time && <span className="inline-flex items-center gap-1"><Clock className="size-3" />{e.time}</span>}
                    {e.location && <span className="inline-flex items-center gap-1 truncate"><MapPin className="size-3" />{e.location}</span>}
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      )}
    </div>
  );
}
