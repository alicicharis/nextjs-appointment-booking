import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert, TablesUpdate } from '../../database.types';
import { unwrap } from '@/lib/utils';

export const getServiceById = async (
  supabase: SupabaseClient<Database>,
  id: string
) => {
  return unwrap(
    await supabase.from('services').select('*').eq('id', id).single()
  );
};

export const createService = async (
  supabase: SupabaseClient<Database>,
  payload: TablesInsert<'services'>
) => {
  return unwrap(await supabase.from('services').insert(payload));
};

export const updateService = async (
  supabase: SupabaseClient<Database>,
  id: string,
  payload: TablesUpdate<'services'>
) => {
  return unwrap(await supabase.from('services').update(payload).eq('id', id));
};

export const deleteService = async (
  supabase: SupabaseClient<Database>,
  id: string
) => {
  return unwrap(await supabase.from('services').delete().eq('id', id));
};
