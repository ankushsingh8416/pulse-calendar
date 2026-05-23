import { Search, Moon, Sun, Monitor, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { useTheme } from "@/hooks/useTheme";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

export function Topbar({ onNewEvent }: { onNewEvent: () => void }) {
  const search = useCalendarStore((s) => s.filters.search);
  const setFilters = useCalendarStore((s) => s.setFilters);
  const { theme, setTheme } = useTheme();

  const ThemeIcon = theme === "dark" ? Moon : theme === "light" ? Sun : Monitor;

  return (
    <header className="sticky top-0 z-30 glass border-b border-border px-4 lg:px-8 py-3 flex items-center gap-3">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setFilters({ search: e.target.value })}
          placeholder="Search events…"
          className="pl-9 bg-background/50 border-border h-10 rounded-xl"
        />
      </div>
      <Button onClick={onNewEvent} className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 shadow-glow h-10">
        <Plus className="size-4" />
        <span className="hidden sm:inline">New event</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10">
            <ThemeIcon className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl">
          <DropdownMenuItem onClick={() => setTheme("light")}><Sun className="size-4 mr-2"/>Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}><Moon className="size-4 mr-2"/>Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("system")}><Monitor className="size-4 mr-2"/>System</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Avatar className="size-10 ring-2 ring-border">
        <AvatarFallback className="gradient-primary text-primary-foreground font-semibold">YOU</AvatarFallback>
      </Avatar>
    </header>
  );
}
