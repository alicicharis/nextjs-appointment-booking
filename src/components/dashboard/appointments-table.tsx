'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Calendar,
  Clock,
  User,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  X,
} from 'lucide-react';
import { useState } from 'react';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  amount: number;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    clientName: 'John Doe',
    service: 'Haircut & Styling',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'confirmed',
    amount: 50,
  },
  {
    id: '2',
    clientName: 'Jane Smith',
    service: 'Consultation',
    date: '2024-01-15',
    time: '2:30 PM',
    status: 'confirmed',
    amount: 25,
  },
  {
    id: '3',
    clientName: 'Mike Johnson',
    service: 'Full Service',
    date: '2024-01-16',
    time: '4:00 PM',
    status: 'pending',
    amount: 120,
  },
  {
    id: '4',
    clientName: 'Sarah Williams',
    service: 'Color Treatment',
    date: '2024-01-14',
    time: '11:00 AM',
    status: 'completed',
    amount: 150,
  },
  {
    id: '5',
    clientName: 'David Brown',
    service: 'Haircut & Styling',
    date: '2024-01-17',
    time: '3:00 PM',
    status: 'pending',
    amount: 50,
  },
];

const statusColors = {
  confirmed:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function AppointmentsTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = mockAppointments.filter((apt) => {
    const matchesSearch =
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.service.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold">All Appointments</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track all appointments
            </p>
          </div>
          <Button size="sm">
            <Calendar className="size-4 mr-2" />
            New Appointment
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by client or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={statusFilter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('all')}
            >
              All
            </Button>
            <Button
              variant={statusFilter === 'confirmed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('confirmed')}
            >
              Confirmed
            </Button>
            <Button
              variant={statusFilter === 'pending' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('pending')}
            >
              Pending
            </Button>
            <Button
              variant={statusFilter === 'completed' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setStatusFilter('completed')}
            >
              Completed
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Client
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Service
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Date & Time
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Status
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">
                Amount
              </th>
              <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No appointments found
                </td>
              </tr>
            ) : (
              filteredAppointments.map((appointment) => (
                <tr
                  key={appointment.id}
                  className="border-b hover:bg-accent/50 transition-colors"
                >
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="size-4 text-primary" />
                      </div>
                      <span className="font-medium">
                        {appointment.clientName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">{appointment.service}</td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>{appointment.date}</span>
                      <Clock className="size-4 text-muted-foreground ml-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[appointment.status]
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    ${appointment.amount}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="size-8">
                        <Eye className="size-4" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="icon" className="size-8">
                        <Edit className="size-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 text-destructive"
                      >
                        <X className="size-4" />
                        <span className="sr-only">Cancel</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
