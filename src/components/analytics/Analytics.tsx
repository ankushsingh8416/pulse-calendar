import { useMemo } from "react";
import { format, subMonths, startOfMonth, isThisWeek, isThisMonth } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from "recharts";
import { useCalendarStore } from "@/store/useCalendarStore";
import { motion } from "framer-motion";
import { TrendingUp, CheckCircle2, Clock, Star } from "lucide-react";

export function Analytics() {
  const events = useCalendarStore((s) => s.events);
  const categories = useCalendarStore((s) => s.categories);

  const monthly = useMemo(() => {
    const out: { month: string; events: number; completed: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const m = startOfMonth(subMonths(new Date(), i));
      const key = format(m, "yyyy-MM");
      const monthEvents = events.filter((e) => e.date.startsWith(key));
      out.push({
        month: format(m, "MMM"),
        events: monthEvents.length,
        completed: monthEvents.filter((e) => e.completed).length,
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
  const thisWeek = events.filter((e) => isThisWeek(new Date(e.date), { weekStartsOn: 1 })).length;
  const thisMonth = events.filter((e) => isThisMonth(new Date(e.date))).length;
  const highPriority = events.filter((e) => e.priority === "high" && !e.completed).length;
  const completionRate = events.length > 0 ? Math.round((completed / events.length) * 100) : 0;

  const summaryCards = [
    { label: "This week", value: thisWeek, icon: TrendingUp, accent: "from-blue-500 to-cyan-500" },
    { label: "This month", value: thisMonth, icon: Clock, accent: "from-violet-500 to-fuchsia-500" },
    { label: "Completion rate", value: `${completionRate}%`, icon: CheckCircle2, accent: "from-emerald-500 to-teal-500" },
    { label: "High priority", value: highPriority, icon: Star, accent: "from-amber-500 to-orange-500" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-soft"
          >
            <div className={`absolute -top-8 -right-8 size-28 rounded-full bg-linear-to-br ${card.accent} opacity-20 blur-2xl`} />
            <card.icon className="size-4 text-muted-foreground mb-3" />
            <div className="text-3xl font-bold tracking-tight">{card.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{card.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-1">Events per month</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 6 months — total vs completed</p>
          <div className="h-60">
            <ResponsiveContainer>
              <BarChart data={monthly} barGap={4}>
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  cursor={{ fill: "var(--accent)", opacity: 0.3 }}
                />
                <Bar dataKey="events" name="Total" fill="var(--primary)" radius={[6, 6, 0, 0]} opacity={0.5} />
                <Bar dataKey="completed" name="Completed" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-1">Category distribution</h3>
          <p className="text-xs text-muted-foreground mb-4">{events.length} total events</p>
          <div className="h-60">
            {byCategory.length === 0 ? (
              <div className="h-full grid place-items-center text-sm text-muted-foreground">
                <div className="text-center space-y-2">
                  <div className="mx-auto size-10 rounded-full gradient-primary opacity-30" />
                  <p>No data yet — add events to see analytics</p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={byCategory} dataKey="value" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {byCategory.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                  <Tooltip contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-1">Completion trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Monthly completion rate</p>
          <div className="h-60">
            <ResponsiveContainer>
              <LineChart data={monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} width={28} />
                <Tooltip
                  contentStyle={{ background: "var(--popover)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                />
                <Line type="monotone" dataKey="completed" name="Completed" stroke="var(--primary)" strokeWidth={2.5} dot={{ r: 4, fill: "var(--primary)" }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
          <h3 className="font-semibold mb-4">Completed vs Pending</h3>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="rounded-xl bg-linear-to-br from-emerald-500/10 to-teal-500/10 p-5 border border-emerald-500/20">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="size-4 text-emerald-500" />
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Completed</div>
              </div>
              <div className="text-4xl font-bold">{completed}</div>
              <div className="text-xs text-muted-foreground mt-1">{completionRate}% of total</div>
            </div>
            <div className="rounded-xl bg-linear-to-br from-violet-500/10 to-fuchsia-500/10 p-5 border border-violet-500/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="size-4 text-violet-500" />
                <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Pending</div>
              </div>
              <div className="text-4xl font-bold">{pending}</div>
              <div className="text-xs text-muted-foreground mt-1">{100 - completionRate}% of total</div>
            </div>
          </div>
          <div className="rounded-xl bg-muted/40 h-3 overflow-hidden">
            <div
              className="h-full gradient-primary rounded-xl transition-all duration-700"
              style={{ width: `${completionRate}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{completionRate}% completion rate overall</p>
        </div>
      </div>
    </div>
  );
}
