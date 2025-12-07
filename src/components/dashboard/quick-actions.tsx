import { Button } from '@/components/ui/button';
import { Plus, Calendar, Users, Settings } from 'lucide-react';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild className="h-auto flex-col items-start gap-2 p-4">
          <Link href="/appointments/new">
            <Plus className="size-5" />
            <div className="text-left">
              <div className="font-semibold">New Appointment</div>
              <div className="text-xs opacity-90">Book a new appointment</div>
            </div>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-auto flex-col items-start gap-2 p-4"
        >
          <Link href="/calendar">
            <Calendar className="size-5" />
            <div className="text-left">
              <div className="font-semibold">View Calendar</div>
              <div className="text-xs opacity-90">See your schedule</div>
            </div>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-auto flex-col items-start gap-2 p-4"
        >
          <Link href="/clients">
            <Users className="size-5" />
            <div className="text-left">
              <div className="font-semibold">Manage Clients</div>
              <div className="text-xs opacity-90">View client list</div>
            </div>
          </Link>
        </Button>
        <Button
          variant="outline"
          asChild
          className="h-auto flex-col items-start gap-2 p-4"
        >
          <Link href="/services">
            <Settings className="size-5" />
            <div className="text-left">
              <div className="font-semibold">Services</div>
              <div className="text-xs opacity-90">Manage services</div>
            </div>
          </Link>
        </Button>
      </div>
    </div>
  );
}
