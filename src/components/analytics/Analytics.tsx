import { useMemo } from "react";
import { format, parseISO, subMonths, startOfMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend } from "recharts";
import { useCalendarStore } from "@/store/useCalendarStore";

export function Analytics() {
  const events = useCalendarStore((s) => s.events);
  const categories = useCalendarStore((s) => s.categories);

  const monthly = useMemo(() => {
    const out: { month: string; events: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = startOfMonth(subMonths(new Date(), i));
      const key = format(m, "yyyy-MM");
      out.push({
        month: format(m, "MMM"),
        events: events.filter((e) => e.date.startsWith(key)).length,
      });
    }
    return out;
  }, [events]);

  const byCategory = useMemo(() => {
    return categories.map((c) => ({
      name: c.name,
      value: events.filter((e) => e.categoryId === c.id).length,
      color: c.color,
    })).filter((c) => c.value > 0);
  }, [events, categories]);

  const completed = events.filter((e) => e.completed).length;
  const pending = events.length - completed;

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-semibold mb-1">Events per month</h3>
        <p className="text-xs text-muted-foreground mb-4">Last 6 months</p>
        <div className="h-64">
          <ResponsiveContainer>
            <BarChart data={monthly}>
              <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false}/>
              <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false}/>
              <Tooltip
                contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}
                cursor={{ fill: "var(--accent)", opacity: 0.3 }}
              />
              <Bar dataKey="events" fill="var(--primary)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-semibold mb-1">Category distribution</h3>
        <p className="text-xs text-muted-foreground mb-4">{events.length} events</p>
        <div className="h-64">
          {byCategory.length === 0 ? (
            <div className="h-full grid place-items-center text-sm text-muted-foreground">No data yet</div>
          ) : (
            <ResponsiveContainer>
              <PieChart>
                <Pie data={byCategory} dataKey="value" innerRadius={60} outerRadius={90} paddingAngle={4}>
                  {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Legend />
                <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12 }}/>
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-5 shadow-soft">
        <h3 className="font-semibold mb-4">Completed vs pending</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Completed</div>
            <div className="text-4xl font-bold mt-2">{completed}</div>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 p-5">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Pending</div>
            <div className="text-4xl font-bold mt-2">{pending}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
