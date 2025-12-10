import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';

export const getExistingAppointments = async (
  supabase: SupabaseClient<Database>,
  staffId: string,
  startTime: string,
  endTime: string
) => {
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .eq('staff_id', staffId)
    .lt('start_time', endTime)
    .gt('end_time', startTime);

  return data;
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
  const { error } = await supabase.from('appointments').insert({
    customer_id: payload.customerId,
    service_id: payload.serviceId,
    staff_id: payload.staffId,
    start_time: payload.startTime,
    end_time: payload.endTime,
    status: 'pending',
  });

  return { error };
};
