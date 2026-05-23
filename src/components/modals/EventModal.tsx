import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCalendarStore } from "@/store/useCalendarStore";
import type { CalendarEvent, Priority, ReminderOffset, RepeatType } from "@/types/event";
import { Trash2, Copy, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const colors = ["#8b5cf6", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#06b6d4", "#ec4899", "#84cc16"];

interface Props {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  initialDate?: string;
  editingId?: string | null;
}

type FormVals = {
  title: string;
  description: string;
  date: string;
  time: string;
  endTime: string;
  categoryId: string;
  priority: Priority;
  reminder: ReminderOffset;
  location: string;
  notes: string;
  color: string;
  repeat: RepeatType;
};

export function EventModal({ open, onOpenChange, initialDate, editingId }: Props) {
  const { categories, events, addEvent, updateEvent, deleteEvent, duplicateEvent, toggleComplete } =
    useCalendarStore();
  const editing = editingId ? events.find((e) => e.id === editingId) : null;

  const { register, handleSubmit, control, reset, watch, setValue } = useForm<FormVals>({
    defaultValues: {
      title: "",
      description: "",
      date: initialDate || new Date().toISOString().slice(0, 10),
      time: "09:00",
      endTime: "10:00",
      categoryId: categories[0]?.id || "personal",
      priority: "medium",
      reminder: 15,
      location: "",
      notes: "",
      color: colors[0],
      repeat: "none",
    },
  });

  useEffect(() => {
    if (open) {
      if (editing) {
        reset({
          title: editing.title,
          description: editing.description || "",
          date: editing.date,
          time: editing.time || "09:00",
          endTime: editing.endTime || "10:00",
          categoryId: editing.categoryId,
          priority: editing.priority,
          reminder: editing.reminder,
          location: editing.location || "",
          notes: editing.notes || "",
          color: editing.color || colors[0],
          repeat: editing.repeat,
        });
      } else {
        reset({
          title: "",
          description: "",
          date: initialDate || new Date().toISOString().slice(0, 10),
          time: "09:00",
          endTime: "10:00",
          categoryId: categories[0]?.id || "personal",
          priority: "medium",
          reminder: 15,
          location: "",
          notes: "",
          color: colors[0],
          repeat: "none",
        });
      }
    }
  }, [open, editingId, initialDate]);

  const onSubmit = (data: FormVals) => {
    if (editing) {
      updateEvent(editing.id, data);
    } else {
      addEvent(data);
    }
    onOpenChange(false);
  };

  const color = watch("color");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-3xl border-border bg-card p-0 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="h-2" style={{ background: color }} />
          <div className="p-6">
            <DialogHeader className="mb-5">
              <DialogTitle className="text-xl font-bold">
                {editing ? "Edit event" : "New event"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Title</Label>
                <Input {...register("title", { required: true })} placeholder="Event title" className="h-11 rounded-xl" autoFocus />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Description</Label>
                <Textarea {...register("description")} placeholder="What's this about?" className="rounded-xl resize-none" rows={2} />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Date</Label>
                  <Input type="date" {...register("date", { required: true })} className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Start</Label>
                  <Input type="time" {...register("time")} className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">End</Label>
                  <Input type="time" {...register("endTime")} className="h-11 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Category</Label>
                  <Controller control={control} name="categoryId" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            <span className="inline-flex items-center gap-2">
                              <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                              {c.name}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Priority</Label>
                  <Controller control={control} name="priority" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Reminder</Label>
                  <Controller control={control} name="reminder" render={({ field }) => (
                    <Select value={String(field.value)} onValueChange={(v) => field.onChange(Number(v) as ReminderOffset)}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">None</SelectItem>
                        <SelectItem value="5">5 min before</SelectItem>
                        <SelectItem value="15">15 min before</SelectItem>
                        <SelectItem value="30">30 min before</SelectItem>
                        <SelectItem value="60">1 hour before</SelectItem>
                        <SelectItem value="1440">1 day before</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
                <div>
                  <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Repeat</Label>
                  <Controller control={control} name="repeat" render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Never</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  )} />
                </div>
              </div>
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Location</Label>
                <Input {...register("location")} placeholder="Optional location" className="h-11 rounded-xl" />
              </div>
              <div>
                <Label className="mb-1.5 block text-xs uppercase tracking-wide text-muted-foreground">Color</Label>
                <div className="flex gap-2 flex-wrap">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setValue("color", c)}
                      className="size-8 rounded-full ring-2 ring-offset-2 ring-offset-card transition-all"
                      style={{ background: c, ["--tw-ring-color" as any]: color === c ? c : "transparent" }}
                      aria-label={c}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-3 border-t border-border">
                {editing && (
                  <>
                    <Button type="button" variant="ghost" size="icon" className="rounded-xl text-destructive" onClick={() => { deleteEvent(editing.id); onOpenChange(false); }}>
                      <Trash2 className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-xl" onClick={() => { duplicateEvent(editing.id); onOpenChange(false); }}>
                      <Copy className="size-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="rounded-xl" onClick={() => { toggleComplete(editing.id); onOpenChange(false); }}>
                      <CheckCircle2 className={`size-4 ${editing.completed ? "text-primary" : ""}`} />
                    </Button>
                  </>
                )}
                <div className="ml-auto flex gap-2">
                  <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl">Cancel</Button>
                  <Button type="submit" className="rounded-xl gradient-primary text-primary-foreground hover:opacity-90 shadow-glow">
                    {editing ? "Save changes" : "Create event"}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
