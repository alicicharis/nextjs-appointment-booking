'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
import { createClient } from '@/lib/supabase/server';
import {
  getExistingAppointments,
  getServiceById,
  createAppointment,
} from '@/data';

export const bookAppointment = async (payload: {
  serviceId: string;
  staffId: string;
  startTime: string;
  date: string;
}) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      return { error: 'Unauthorized' };
    }

    const serviceData = await getServiceById(supabase, payload.serviceId);

    if (!serviceData) {
      return { error: 'Service not found' };
    }

    const [startHours, startMinutes] = payload.startTime.split(':').map(Number);

    const totalMinutes =
      startHours * 60 + startMinutes + serviceData?.duration!;
    const endHours = Math.floor(totalMinutes / 60) % 24;
    const endMinutes = totalMinutes % 60;

    const endTimeString = `${String(endHours).padStart(2, '0')}:${String(
      endMinutes
    ).padStart(2, '0')}:00`;

    const startTimeWithSeconds = `${payload.startTime}:00`;

    const existingAppointments = await getExistingAppointments(
      supabase,
      payload.staffId,
      timeToTimestampz(startTimeWithSeconds, payload.date),
      timeToTimestampz(endTimeString, payload.date)
    );

    if (existingAppointments && existingAppointments?.length > 0) {
      return { error: 'Slot already booked' };
    }

    const startTimeFormatted = timeToTimestampz(
      startTimeWithSeconds,
      payload.date
    );
    const endTimeFormatted = timeToTimestampz(endTimeString, payload.date);

    const { error: newAppointmentError } = await createAppointment(supabase, {
      customerId: user.user.id,
      serviceId: payload.serviceId,
      staffId: payload.staffId,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
    });

    if (newAppointmentError) {
      return { error: newAppointmentError.message };
    }

    return { success: true };
  } catch (error) {
    console.log('Error creating appointment: ', error);
    return { error: 'Failed to create appointment' };
  }
};

function timeToTimestampz(time: string, date?: string): string {
  const day = date ?? new Date().toISOString().split('T')[0];

  const timeWithSeconds = time.length === 5 ? `${time}:00` : time;

  return `${day}T${timeWithSeconds}.000Z`;
}
