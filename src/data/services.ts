import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../database.types';

export const getServiceById = async (
  supabase: SupabaseClient<Database>,
  id: string
) => {
  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  return data;
};
