'use client';

import { updateAppointmentStatus } from '@/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, Edit, Loader2, Search, User, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import Link from 'next/link';

type Appointment = {
  id: string;
  start_time: string;
  status: string;
  services: {
    title: string;
    price: number;
  };
  customer: {
    id: string;
    username: string | null;
  };
};

const statusColors = {
  confirmed:
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  pending:
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  completed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function AppointmentsTable({
  appointments,
  role,
}: {
  appointments: Appointment[];
  role: 'staff' | 'customer';
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredAppointments = appointments.filter(
    (appointment) =>
      (appointment.services.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) &&
        appointment.status === statusFilter) ||
      statusFilter === 'all'
  );

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
          {role === 'customer' && (
            <Link href="/services">
              <Button size="sm">
                <Calendar className="size-4 mr-2" />
                New Appointment
              </Button>
            </Link>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search by service..."
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
                        {appointment.customer?.username}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-sm">
                    {appointment.services.title}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="size-4 text-muted-foreground" />
                      <span>
                        {appointment.start_time?.toString().split('T')[0]}
                      </span>
                      <Clock className="size-4 text-muted-foreground ml-2" />
                      <span>
                        {appointment.start_time
                          ?.toString()
                          .split('T')[1]
                          .slice(0, 5)}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[
                          appointment.status as keyof typeof statusColors
                        ]
                      }`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-semibold">
                    ${appointment.services.price}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center justify-end gap-2">
                      {role === 'staff' &&
                        appointment.status !== 'cancelled' &&
                        appointment.status !== 'completed' && (
                          <AppointmentEditModal appointment={appointment} />
                        )}
                      {role === 'customer' &&
                        appointment.status !== 'completed' &&
                        appointment.status !== 'cancelled' && (
                          <AppointmentCancelModal appointment={appointment} />
                        )}
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

const AppointmentEditModal = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [status, setStatus] = useState(appointment.status);
  const [updating, setUpdating] = useState<boolean>(false);

  const updateStatusHandler = async () => {
    setUpdating(true);
    const response = await updateAppointmentStatus({
      appointmentId: appointment.id,
      status: status,
    });
    if (response?.success) {
      toast.success('Appointment status updated successfully');
      setOpen(false);
      router.refresh();
    }
    if (response?.error) {
      toast.error(response?.error);
    }
    setUpdating(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <Edit className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change status</DialogTitle>
        </DialogHeader>

        <Select value={status} onValueChange={(value) => setStatus(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={status} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Status</SelectLabel>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            variant="default"
            disabled={updating || appointment.status === status}
            onClick={updateStatusHandler}
          >
            {updating ? <Loader2 className="size-4 animate-spin" /> : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const AppointmentCancelModal = ({
  appointment,
}: {
  appointment: Appointment;
}) => {
  const router = useRouter();

  const [open, setOpen] = useState<boolean>(false);
  const [cancelling, setCancelling] = useState<boolean>(false);

  const cancelAppointmentHandler = async () => {
    setCancelling(true);
    const response = await updateAppointmentStatus({
      appointmentId: appointment.id,
      status: 'cancelled',
    });

    if (response?.success) {
      toast.success('Appointment cancelled successfully');
      setOpen(false);
      router.refresh();
    }
    if (response?.error) {
      toast.error(response?.error);
    }
    setCancelling(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8">
          <X className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cancel Appointment</DialogTitle>
          <DialogDescription>
            Are you sure you want to cancel this appointment?
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">No</Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={cancelAppointmentHandler}
            disabled={cancelling}
          >
            {cancelling ? <Loader2 className="size-4 animate-spin" /> : 'Yes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
