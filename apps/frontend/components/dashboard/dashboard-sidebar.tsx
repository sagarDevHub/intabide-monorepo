'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Home, LayoutDashboard, Settings, FolderOpen, Star, History, Code2 } from 'lucide-react';

interface Playground {
  id: string;
  name: string;
  icon?: string;
  starred: boolean;
}

const MOCK_PLAYGROUNDS: Playground[] = [
  { id: '1', name: 'My Next.js App', starred: true },
  { id: '2', name: 'Express API', starred: false },
];

export function DashboardSidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  const starred = MOCK_PLAYGROUNDS.filter(p => p.starred);
  const recent = MOCK_PLAYGROUNDS.slice(0, 5);

  return (
    <Sidebar variant="inset" collapsible="icon">
      <SidebarHeader className="border-b py-2.5">
        <Link href="/" className="flex items-center gap-2 px-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="font-extrabold text-sm tracking-wider group-data-[collapsible=icon]:hidden">
            INTABIDE
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-2 px-2 pt-4">
        {/* Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/')}>
                <Link href="/" className="flex items-center gap-2 w-full">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton isActive={isActive('/dashboard')}>
                <Link href="/dashboard" className="flex items-center gap-2 w-full">
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Starred */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase flex items-center gap-2">
            <Star className="h-3.5 w-3.5" />
            Starred
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {starred.length === 0 ? (
                <div className="text-center text-xs text-muted-foreground py-2">
                  No starred projects
                </div>
              ) : (
                starred.map(p => (
                  <SidebarMenuItem key={p.id}>
                    <SidebarMenuButton>
                      <Link href={`/playground/${p.id}`} className="flex items-center gap-2 w-full">
                        <FolderOpen className="h-4 w-4" />
                        <span>{p.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Recent */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase flex items-center gap-2">
            <History className="h-3.5 w-3.5" />
            Recent
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {recent.map(p => (
                <SidebarMenuItem key={p.id}>
                  <SidebarMenuButton>
                    <Link href={`/playground/${p.id}`} className="flex items-center gap-2 w-full">
                      <FolderOpen className="h-4 w-4" />
                      <span>{p.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Link href="/settings" className="flex items-center gap-2 w-full">
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
