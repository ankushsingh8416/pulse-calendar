export type Priority = "low" | "medium" | "high";
export type RepeatType = "none" | "daily" | "weekly" | "monthly" | "yearly";
export type ReminderOffset = 0 | 5 | 15 | 30 | 60 | 1440;

export interface Category {
  id: string;
  name: string;
  color: string; // hex
  icon: string; // lucide name
}

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO yyyy-MM-dd
  time?: string; // HH:mm
  endTime?: string;
  categoryId: string;
  priority: Priority;
  reminder: ReminderOffset;
  location?: string;
  notes?: string;
  color?: string;
  repeat: RepeatType;
  completed: boolean;
  createdAt: number;
}

export type ThemeMode = "light" | "dark" | "system";
