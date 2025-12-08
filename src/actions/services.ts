'use server';

import { createClient } from '@/lib/supabase/server';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert } from '../../database.types';
import { createServiceSchema, CreateServiceSchema } from '@/validations';

export async function createService(payload: CreateServiceSchema) {
  try {
    const isValidPayload = createServiceSchema.safeParse(payload);
    if (!isValidPayload.success) {
      return { error: 'Invalid form data' };
    }

    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user.user?.id || user.user?.role !== 'staff') {
      return { error: 'Unauthorized' };
    }

    const dbPayload: TablesInsert<'services'> = {
      user_id: user.user?.id,
      ...payload,
    };

    const { error } = await supabase.from('services').insert(dbPayload);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create service' };
  }
}

export async function updateService(id: string, payload: CreateServiceSchema) {
  try {
    const isValidPayload = createServiceSchema.safeParse(payload);
    if (!isValidPayload.success) {
      return { error: 'Invalid form data' };
    }

    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user.user?.id || user.user?.role !== 'staff') {
      return { error: 'Unauthorized' };
    }

    const { error } = await supabase
      .from('services')
      .update(payload)
      .eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user.user?.id || user.user?.role !== 'staff') {
      return { error: 'Unauthorized' };
    }

    const { error } = await supabase.from('services').delete().eq('id', id);

    if (error) {
      return { error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: 'Failed to delete service' };
  }
}
