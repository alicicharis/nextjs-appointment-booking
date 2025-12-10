import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';
import { unwrap } from '@/lib/utils';

export const getAllAppointments = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  return unwrap(
    await supabase
      .from('appointments')
      .select(
        `
      id,
      start_time,
      status,
      services (title, price),
      customer:profiles!customer_id (id, username)
      `
      )
      .or(`customer_id.eq.${userId},staff_id.eq.${userId}`)
      .order('start_time', { ascending: false })
  );
};

export const getExistingAppointments = async (
  supabase: SupabaseClient<Database>,
  staffId: string,
  startTime: string,
  endTime: string
) => {
  return unwrap(
    await supabase
      .from('appointments')
      .select('*')
      .eq('staff_id', staffId)
      .lt('start_time', endTime)
      .gt('end_time', startTime)
  );
};

export const createAppointment = async (
  supabase: SupabaseClient<Database>,
  payload: {
    customerId: string;
    serviceId: string;
    staffId: string;
    startTime: string;
    endTime: string;
  }
) => {
  return unwrap(
    await supabase.from('appointments').insert({
      customer_id: payload.customerId,
      service_id: payload.serviceId,
      staff_id: payload.staffId,
      start_time: payload.startTime,
      end_time: payload.endTime,
      status: 'pending',
    })
  );
};
