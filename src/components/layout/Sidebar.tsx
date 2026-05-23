import { Link } from "@tanstack/react-router";
import { Calendar, LayoutDashboard, BarChart3, Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/calendar", label: "Calendar", icon: Calendar },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-sidebar-border bg-sidebar p-5 gap-2 shrink-0">
      <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
        <div className="size-9 rounded-xl gradient-primary grid place-items-center shadow-glow">
          <Sparkles className="size-5 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-bold text-sidebar-foreground">Pulse</span>
          <span className="text-xs text-muted-foreground">Calendar</span>
        </div>
      </div>
      <nav className="flex flex-col gap-1">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            className="group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent transition-colors data-[status=active]:text-sidebar-primary-foreground"
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-active"
                    className="absolute inset-0 rounded-xl gradient-primary shadow-glow"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <item.icon className="size-4 relative z-10" />
                <span className="relative z-10">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </nav>
      <div className="mt-auto p-4 rounded-2xl glass">
        <p className="text-xs text-muted-foreground">All your data lives in this browser. No account needed.</p>
      </div>
    </aside>
  );
}

export function MobileNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border bg-card/80 backdrop-blur-xl">
      <div className="flex items-center justify-around py-2">
        {nav.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            activeOptions={{ exact: true }}
            className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg text-xs text-muted-foreground data-[status=active]:text-primary"
          >
            <item.icon className="size-5" />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
