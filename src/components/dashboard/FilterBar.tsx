import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCalendarStore } from "@/store/useCalendarStore";
import { cn } from "@/lib/utils";

export function FilterBar() {
  const { categories, filters, setFilters } = useCalendarStore();
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1.5 text-xs text-muted-foreground mr-1">
        <Filter className="size-3.5" /> Filter
      </div>
      <button
        onClick={() => setFilters({ categoryId: null })}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors",
          filters.categoryId === null
            ? "gradient-primary text-primary-foreground border-transparent shadow-glow"
            : "bg-card border-border hover:bg-accent",
        )}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => setFilters({ categoryId: filters.categoryId === c.id ? null : c.id })}
          className={cn(
            "px-3 py-1.5 rounded-full text-xs font-medium border transition-colors inline-flex items-center gap-1.5",
            filters.categoryId === c.id
              ? "border-transparent text-primary-foreground shadow-glow"
              : "bg-card border-border hover:bg-accent",
          )}
          style={filters.categoryId === c.id ? { background: c.color } : {}}
        >
          <span className="size-2 rounded-full" style={{ background: c.color }} />
          {c.name}
        </button>
      ))}
      <div className="ml-auto flex items-center gap-2">
        <Button
          variant={filters.showCompleted ? "secondary" : "outline"}
          size="sm"
          onClick={() => setFilters({ showCompleted: !filters.showCompleted })}
          className="rounded-full h-8"
        >
          {filters.showCompleted ? "Showing completed" : "Hiding completed"}
        </Button>
      </div>
    </div>
  );
}
