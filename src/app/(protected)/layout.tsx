import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
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
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Header } from '@/components/dashboard/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { UpcomingAppointments } from '@/components/dashboard/upcoming-appointments';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { ServicesList } from '@/components/dashboard/services-list';
import { AppointmentsTable } from '@/components/dashboard/appointments-table';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  ClipboardList,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const menuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    url: '/dashboard',
  },
  {
    title: 'Services',
    icon: Sparkles,
    url: '/services',
  },
];

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center gap-2 px-2 py-4">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calendar className="size-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold">Appointment Booker</span>
              <span className="text-xs text-muted-foreground">
                Booking Platform
              </span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={item.url === '/'}>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter className="border-t border-sidebar-border p-4">
          <div className="text-xs text-muted-foreground">
            <p className="font-medium text-sidebar-foreground">v1.0.0</p>
            <p>© 2024 Appointment Booking</p>
          </div>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <Header
          userEmail={user.email}
          userName={user.user_metadata?.full_name}
        />
        <main className="flex flex-1 flex-col gap-6 p-4 md:p-6 lg:p-8">
          <div className="grid gap-6 grid-cols-12">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
