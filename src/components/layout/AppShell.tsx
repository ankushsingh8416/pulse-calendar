import { useState, type ReactNode } from "react";
import { Sidebar, MobileNav } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { EventModal } from "@/components/modals/EventModal";
import { useTheme } from "@/hooks/useTheme";
import { Toaster } from "@/components/ui/sonner";

interface ShellCtx {
  openNewEvent: (date?: string) => void;
  openEditEvent: (id: string) => void;
}

let ctxRef: ShellCtx | null = null;
export const useShell = () => ctxRef!;

export function AppShell({ children }: { children: ReactNode }) {
  useTheme();
  const [open, setOpen] = useState(false);
  const [initialDate, setInitialDate] = useState<string | undefined>();
  const [editingId, setEditingId] = useState<string | null>(null);

  ctxRef = {
    openNewEvent: (date) => { setEditingId(null); setInitialDate(date); setOpen(true); },
    openEditEvent: (id) => { setEditingId(id); setInitialDate(undefined); setOpen(true); },
  };

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onNewEvent={() => ctxRef!.openNewEvent()} />
        <main className="flex-1 p-4 lg:p-8 pb-24 lg:pb-8">{children}</main>
      </div>
      <MobileNav />
      <EventModal open={open} onOpenChange={setOpen} initialDate={initialDate} editingId={editingId} />
      <Toaster />
    </div>
  );
}
