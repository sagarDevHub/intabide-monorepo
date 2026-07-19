'use client';

import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardSidebar />
      <main className="flex-1 overflow-auto">{children}</main>
    </SidebarProvider>
  );
}
