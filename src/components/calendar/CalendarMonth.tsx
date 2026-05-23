import { useMemo, useState } from "react";
import {
  addMonths,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  addDays,
} from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { cn } from "@/lib/utils";

interface Props {
  onSelectDate: (iso: string) => void;
  onSelectEvent: (id: string) => void;
}

export function CalendarMonth({ onSelectDate, onSelectEvent }: Props) {
  const [cursor, setCursor] = useState(new Date());
  const events = useCalendarStore((s) => s.events);
  const categories = useCalendarStore((s) => s.categories);

  const days = useMemo(() => {
    const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
    const end = endOfWeek(endOfMonth(cursor), { weekStartsOn: 1 });
    const out: Date[] = [];
    let d = start;
    while (d <= end) {
      out.push(d);
      d = addDays(d, 1);
    }
    return out;
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>();
    for (const e of events) {
      const list = map.get(e.date) || [];
      list.push(e);
      map.set(e.date, list);
    }
    return map;
  }, [events]);

  const colorFor = (catId: string, override?: string) =>
    override || categories.find((c) => c.id === catId)?.color || "#8b5cf6";

  return (
    <div className="rounded-3xl bg-card shadow-soft border border-border overflow-hidden">
      <div className="flex items-center justify-between p-5 border-b border-border">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{format(cursor, "MMMM yyyy")}</h2>
          <p className="text-sm text-muted-foreground">{events.length} total events</p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={() => setCursor(subMonths(cursor, 1))} className="rounded-xl"><ChevronLeft className="size-4" /></Button>
          <Button variant="outline" onClick={() => setCursor(new Date())} className="rounded-xl h-9">Today</Button>
          <Button variant="ghost" size="icon" onClick={() => setCursor(addMonths(cursor, 1))} className="rounded-xl"><ChevronRight className="size-4" /></Button>
        </div>
      </div>
      <div className="grid grid-cols-7 text-xs font-medium text-muted-foreground border-b border-border">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d} className="px-3 py-2 text-center">{d}</div>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={format(cursor, "yyyy-MM")}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-7 auto-rows-fr"
        >
          {days.map((d) => {
            const iso = format(d, "yyyy-MM-dd");
            const dayEvents = eventsByDate.get(iso) || [];
            const inMonth = isSameMonth(d, cursor);
            const today = isToday(d);
            return (
              <button
                key={iso}
                onClick={() => onSelectDate(iso)}
                className={cn(
                  "min-h-[96px] sm:min-h-[112px] text-left p-2 border-r border-b border-border last:border-r-0 transition-colors hover:bg-accent/40 relative",
                  !inMonth && "bg-muted/40",
                )}
              >
                <div className={cn(
                  "inline-flex items-center justify-center size-7 text-xs font-semibold rounded-full",
                  today && "gradient-primary text-primary-foreground shadow-glow",
                  !today && inMonth && "text-foreground",
                  !inMonth && "text-muted-foreground",
                )}>
                  {format(d, "d")}
                </div>
                <div className="mt-1 space-y-1">
                  {dayEvents.slice(0, 3).map((e) => (
                    <div
                      key={e.id}
                      onClick={(ev) => { ev.stopPropagation(); onSelectEvent(e.id); }}
                      className={cn(
                        "text-[11px] font-medium truncate rounded-md px-1.5 py-0.5 cursor-pointer hover:opacity-90",
                        e.completed && "line-through opacity-60",
                      )}
                      style={{
                        background: colorFor(e.categoryId, e.color) + "22",
                        color: colorFor(e.categoryId, e.color),
                      }}
                    >
                      {e.time && <span className="opacity-70 mr-1">{e.time}</span>}
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-muted-foreground px-1">+{dayEvents.length - 3} more</div>
                  )}
                </div>
              </button>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
