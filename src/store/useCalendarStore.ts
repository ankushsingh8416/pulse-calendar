import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CalendarEvent, Category, Priority, ThemeMode } from "@/types/event";

const defaultCategories: Category[] = [
  { id: "personal", name: "Personal", color: "#8b5cf6", icon: "User" },
  { id: "work", name: "Work", color: "#3b82f6", icon: "Briefcase" },
  { id: "study", name: "Study", color: "#10b981", icon: "BookOpen" },
  { id: "birthday", name: "Birthday", color: "#f59e0b", icon: "Cake" },
  { id: "meeting", name: "Meeting", color: "#ef4444", icon: "Users" },
  { id: "travel", name: "Travel", color: "#06b6d4", icon: "Plane" },
];

interface Filters {
  categoryId: string | null;
  priority: Priority | null;
  showCompleted: boolean;
  search: string;
  sortBy: "date" | "priority" | "recent";
}

interface CalendarState {
  events: CalendarEvent[];
  categories: Category[];
  theme: ThemeMode;
  filters: Filters;
  addEvent: (e: Omit<CalendarEvent, "id" | "createdAt" | "completed">) => void;
  updateEvent: (id: string, e: Partial<CalendarEvent>) => void;
  deleteEvent: (id: string) => void;
  duplicateEvent: (id: string) => void;
  toggleComplete: (id: string) => void;
  addCategory: (c: Omit<Category, "id">) => void;
  setTheme: (t: ThemeMode) => void;
  setFilters: (f: Partial<Filters>) => void;
}

const uid = () => Math.random().toString(36).slice(2, 11);

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set) => ({
      events: [],
      categories: defaultCategories,
      theme: "system",
      filters: {
        categoryId: null,
        priority: null,
        showCompleted: true,
        search: "",
        sortBy: "date",
      },
      addEvent: (e) =>
        set((s) => ({
          events: [
            ...s.events,
            { ...e, id: uid(), createdAt: Date.now(), completed: false },
          ],
        })),
      updateEvent: (id, patch) =>
        set((s) => ({
          events: s.events.map((ev) => (ev.id === id ? { ...ev, ...patch } : ev)),
        })),
      deleteEvent: (id) =>
        set((s) => ({ events: s.events.filter((e) => e.id !== id) })),
      duplicateEvent: (id) =>
        set((s) => {
          const ev = s.events.find((e) => e.id === id);
          if (!ev) return s;
          return {
            events: [
              ...s.events,
              { ...ev, id: uid(), title: ev.title + " (copy)", createdAt: Date.now() },
            ],
          };
        }),
      toggleComplete: (id) =>
        set((s) => ({
          events: s.events.map((e) =>
            e.id === id ? { ...e, completed: !e.completed } : e,
          ),
        })),
      addCategory: (c) =>
        set((s) => ({ categories: [...s.categories, { ...c, id: uid() }] })),
      setTheme: (theme) => set({ theme }),
      setFilters: (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
    }),
    {
      name: "calendar-app-state",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
