import { Button } from '@/components/ui/button';
import { Clock, MapPin, User } from 'lucide-react';
import Link from 'next/link';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  time: string;
  date: string;
  location?: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'John Doe',
    service: 'Haircut & Styling',
    time: '10:00 AM',
    date: 'Today',
    location: 'Main Office',
    status: 'confirmed',
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    service: 'Consultation',
    time: '2:30 PM',
    date: 'Today',
    location: 'Main Office',
    status: 'confirmed',
  },
  {
    id: '3',
    clientName: 'Mike Johnson',
    service: 'Full Service',
    time: '4:00 PM',
    date: 'Today',
    status: 'pending',
  },
];

export function UpcomingAppointments() {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upcoming Appointments</h2>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/appointments">View all</Link>
        </Button>
      </div>
      <div className="space-y-4">
        {mockAppointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-start gap-4 rounded-md border p-4 hover:bg-accent/50 transition-colors"
          >
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <User className="size-4 text-muted-foreground" />
                <span className="font-medium">{appointment.clientName}</span>
                <span
                  className={`ml-auto text-xs px-2 py-0.5 rounded-full ${
                    appointment.status === 'confirmed'
                      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                      : appointment.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                      : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {appointment.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-2">
                {appointment.service}
              </p>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  <span>
                    {appointment.date} • {appointment.time}
                  </span>
                </div>
                {appointment.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="size-3" />
                    <span>{appointment.location}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
