'use client';

import { Calendar } from '@/components/ui/calendar';
import { useEffect, useMemo, useState } from 'react';
import { Tables } from '../../../database.types';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { createAppointmentAction } from '@/actions/appointments';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type StaffAvailabilityWithProfile = Tables<'staff_availability'> & {
  profiles: {
    id: string;
    username: string | null;
  } | null;
};

const ServicesBookForm = ({
  service,
  staffAvailability,
  appointments,
  slotInterval = 10,
}: {
  service: Tables<'services'>;
  staffAvailability: StaffAvailabilityWithProfile[];
  slotInterval?: number;
  appointments: Tables<'appointments'>[];
}) => {
  const router = useRouter();

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [selectedSlot, setSelectedSlot] = useState<string | undefined>(
    undefined
  );
  const [selectedStaffId, setSelectedStaffId] = useState<string | undefined>(
    undefined
  );

  const getWeekday = (date: Date): number => {
    return date.getDay();
  };

  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins
      .toString()
      .padStart(2, '0')}`;
  };

  const isoToTime = (isoString: string): string => {
    const date = new Date(isoString);
    return minutesToTime(date.getUTCHours() * 60 + date.getUTCMinutes());
  };

  const generateAvailableSlots = (
    start: string,
    end: string,
    serviceDuration: number,
    step: number,
    bookings: { start: string; end: string }[]
  ): string[] => {
    const startMinutes = timeToMinutes(start);
    const endMinutes = timeToMinutes(end);
    const availableSlots: string[] = [];

    const bookingsInMinutes = bookings.map((booking) => ({
      start: timeToMinutes(booking.start),
      end: timeToMinutes(booking.end),
    }));

    let currentTime = startMinutes;

    while (currentTime + serviceDuration <= endMinutes) {
      const slotEndTime = currentTime + serviceDuration;

      const hasOverlap = bookingsInMinutes.some(
        (booking) => currentTime < booking.end && slotEndTime > booking.start
      );

      if (!hasOverlap) {
        availableSlots.push(minutesToTime(currentTime));
      }

      currentTime += step;
    }

    return availableSlots;
  };

  const availableStaff = useMemo(() => {
    const staffMap = new Map<string, { id: string; username: string | null }>();

    staffAvailability.forEach((avail) => {
      if (avail.profiles && !staffMap.has(avail.user_id)) {
        staffMap.set(avail.user_id, {
          id: avail.user_id,
          username: avail.profiles.username,
        });
      }
    });

    return Array.from(staffMap.values());
  }, [staffAvailability]);

  useEffect(() => {
    if (!selectedStaffId && availableStaff.length > 0) {
      setSelectedStaffId(availableStaff[0].id);
    }
  }, [availableStaff, selectedStaffId]);

  const availableTimeSlots = useMemo(() => {
    if (!date || !selectedStaffId) return [];

    const weekday = getWeekday(date);
    const relevantAvailability = staffAvailability.filter(
      (avail) => avail.weekday === weekday && avail.user_id === selectedStaffId
    );

    if (relevantAvailability.length === 0) return [];

    const appointmentsOnDate = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.start_time);

      const isSameDate =
        appointmentDate.getUTCFullYear() === date.getFullYear() &&
        appointmentDate.getUTCMonth() === date.getMonth() &&
        appointmentDate.getUTCDate() === date.getDate();

      return isSameDate && appointment.staff_id === selectedStaffId;
    });

    const bookings: { start: string; end: string }[] = appointmentsOnDate.map(
      (appointment) => ({
        start: isoToTime(appointment.start_time),
        end: isoToTime(appointment.end_time),
      })
    );

    const allSlots: string[] = [];

    relevantAvailability.forEach((avail) => {
      const startTime = avail.start_time.substring(0, 5);
      const endTime = avail.end_time.substring(0, 5);

      const slots = generateAvailableSlots(
        startTime,
        endTime,
        service.duration,
        slotInterval,
        bookings
      );

      allSlots.push(...slots);
    });

    return [...new Set(allSlots)].sort();
  }, [
    date,
    selectedStaffId,
    staffAvailability,
    service.duration,
    slotInterval,
    appointments,
  ]);

  const createAppointmentHandler = async () => {
    try {
      const year = date!.getFullYear();
      const month = String(date!.getMonth() + 1).padStart(2, '0');
      const day = String(date!.getDate()).padStart(2, '0');
      const dateFormatted = `${year}-${month}-${day}`;

      const response = await createAppointmentAction({
        serviceId: service.id,
        staffId: selectedStaffId!,
        startTime: selectedSlot!,
        date: dateFormatted,
      });

      if (response?.success) {
        toast.success('Appointment booked successfully');
        router.push('/dashboard');
      }

      if (!response?.success) {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error((error as Error)?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="col-span-12 rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground">
            Book Service
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Select a date and time to book your appointment
          </p>
        </div>
        <Button
          disabled={!selectedSlot || !date || !selectedStaffId}
          className="min-w-[100px]"
          onClick={createAppointmentHandler}
        >
          Book Appointment
        </Button>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Calendar Section */}
        <div className="shrink-0 flex flex-col items-center lg:items-start">
          <h3 className="text-sm font-medium text-foreground mb-3 w-full">
            Select Date
          </h3>
          <div className="rounded-lg border bg-background p-4 shadow-sm">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-lg"
              disabled={(date) => {
                const today = new Date();
                return date <= today;
              }}
            />
          </div>
        </div>

        {/* Time Slots Section */}
        {date && (
          <div className="flex-1 min-w-0">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-foreground mb-3">
                Select Staff Member
              </h3>
              {availableStaff.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {availableStaff.map((staff) => (
                    <button
                      key={staff.id}
                      onClick={() => {
                        setSelectedStaffId(staff.id);
                        setSelectedSlot(undefined);
                      }}
                      className={cn(
                        'px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200',
                        'hover:border-primary hover:bg-primary/5 hover:text-primary',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                        selectedStaffId === staff.id
                          ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                          : 'bg-background border-border text-foreground'
                      )}
                    >
                      {staff.username || `Staff ${staff.id.slice(0, 8)}`}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No staff members available
                </p>
              )}
            </div>

            {selectedStaffId && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">
                      Available Time Slots
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {availableTimeSlots.map((slot, index) => (
                      <button
                        key={index}
                        className={cn(
                          'px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200',
                          'hover:border-primary hover:bg-primary/5 hover:text-primary',
                          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                          selectedSlot === slot
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm scale-[1.02]'
                            : 'bg-background border-border text-foreground'
                        )}
                        onClick={() => setSelectedSlot(slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-dashed border-muted-foreground/25 bg-muted/30 p-8 text-center">
                    <p className="text-sm text-muted-foreground font-medium">
                      No available time slots for this staff member on this day.
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Please select another date or staff member.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {!date && (
          <div className="flex-1 flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Please select a date to view available time slots
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServicesBookForm;
