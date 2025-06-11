"use client";

import Header from "@/components/header";
import { TasksProvider } from "@/lib/contexts/tasks";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <TasksProvider>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </TasksProvider>
    </div>
  );
}
