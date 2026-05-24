import { Search, Moon, Sun, Monitor, Plus, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { format } from "date-fns";

export function Topbar({ onNewEvent }: { onNewEvent: () => void }) {
  const search = useCalendarStore((s) => s.filters.search);
  const setFilters = useCalendarStore((s) => s.setFilters);
  const events = useCalendarStore((s) => s.events);
  const { theme, setTheme } = useTheme();

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;
  const today = format(new Date(), "yyyy-MM-dd");
  const todayReminders = events.filter((e) => e.date === today && e.reminder > 0 && !e.completed).length;

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-4 lg:px-8 py-3 flex items-center gap-3">
      <div className="relative flex-1 max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search events…"
          className="pl-9 bg-background/50 border-border h-10 rounded-xl text-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          onClick={onNewEvent}
          className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-10 px-4 gap-2"
        >
          <Plus className="size-4" />
          <span className="hidden sm:inline font-medium">New Event</span>
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 relative">
                <Bell className="size-4" />
                {todayReminders > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {todayReminders > 0 ? `${todayReminders} reminder${todayReminders > 1 ? "s" : ""} today` : "No reminders today"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
              <ThemeIcon className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-44">
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">Appearance</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="size-4 mr-2" />Light</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="size-4 mr-2" />Dark</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}><Monitor className="size-4 mr-2" />System</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="size-10 ring-2 ring-border cursor-pointer hover:ring-primary/50 transition-all">
              <AvatarFallback className="gradient-primary text-primary-foreground font-bold text-sm">AK</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl w-52">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-semibold">Ankush</span>
                <span className="text-xs text-muted-foreground font-normal">Personal workspace</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs text-muted-foreground" disabled>
              {events.length} events · Local only
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
