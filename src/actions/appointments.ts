'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
import { createClient } from '@/lib/supabase/server';
import {
  getExistingAppointments,
  getServiceById,
  createAppointment,
  createNotification,
} from '@/data';
import { timeToTimestampz } from '@/lib/utils';

export const createAppointmentAction = async (payload: {
  serviceId: string;
  staffId: string;
  startTime: string;
  date: string;
}) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      throw new Error('Unauthorized');
    }

    const serviceData = await getServiceById(supabase, payload.serviceId);

    if (!serviceData) {
      throw new Error('Service not found');
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
      throw new Error('Slot already booked');
    }

    const startTimeFormatted = timeToTimestampz(
      startTimeWithSeconds,
      payload.date
    );
    const endTimeFormatted = timeToTimestampz(endTimeString, payload.date);

    await createAppointment(supabase, {
      customerId: user.user.id,
      serviceId: payload.serviceId,
      staffId: payload.staffId,
      startTime: startTimeFormatted,
      endTime: endTimeFormatted,
    });

    await createNotification(supabase, {
      title: 'New Appointment Booked',
      body: `New appointment booked for ${serviceData?.title} by ${user.user.user_metadata.username}`,
      userId: payload.staffId,
    }).catch((error) => {
      console.error('Error in createNotification: ', error);
    });

    return { success: true, data: null };
  } catch (error) {
    console.error('Error in createAppointmentAction: ', error);
    return { success: false, error: 'Failed to create appointment' };
  }
};

export const updateAppointmentStatusAction = async (payload: {
  appointmentId: string;
  status: string;
}) => {
  try {
    const supabase: SupabaseClient<Database> = await createClient();
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      throw new Error('Unauthorized');
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status: payload.status })
      .eq('id', payload.appointmentId);

    if (error) {
      console.log('Error: ', error);
      throw new Error('Failed to update appointment status');
    }

    return { success: true, data: null };
  } catch (error) {
    console.error('Error in updateAppointmentStatusAction: ', error);
    return { success: false, error: 'Failed to update appointment status' };
  }
};
