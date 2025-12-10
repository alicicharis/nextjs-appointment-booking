'use server';

import { createClient } from '@/lib/supabase/server';
import { isStaffAuthorized } from '@/lib/utils';

import { createService, deleteService, updateService } from '@/data';
import { createServiceSchema, CreateServiceSchema } from '@/validations';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, TablesInsert } from '../../database.types';

export async function createServiceAction(payload: CreateServiceSchema) {
  try {
    const isValidPayload = createServiceSchema.safeParse(payload);
    if (!isValidPayload.success) {
      throw new Error('Invalid form data');
    }

    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!isStaffAuthorized(user)) {
      throw new Error('Unauthorized');
    }

    const dbPayload: TablesInsert<'services'> = {
      user_id: user.user.id,
      ...payload,
    };

    const newService = await createService(supabase, dbPayload);

    return { success: true, data: newService };
  } catch (error) {
    console.error('Error in createServiceAction: ', error);
    return { success: false, error: 'Failed to create service' };
  }
}

export async function updateServiceAction(
  id: string,
  payload: CreateServiceSchema
) {
  try {
    const isValidPayload = createServiceSchema.safeParse(payload);
    if (!isValidPayload.success) {
      throw new Error('Invalid form data');
    }

    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!isStaffAuthorized(user)) {
      throw new Error('Unauthorized');
    }

    const updatedService = await updateService(supabase, id, payload);

    return { success: true, data: updatedService };
  } catch (error) {
    console.error('Error in updateServiceAction: ', error);
    return { success: false, error: 'Failed to update service' };
  }
}

export async function deleteServiceAction(id: string) {
  try {
    const supabase: SupabaseClient<Database> = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!isStaffAuthorized(user)) {
      throw new Error('Unauthorized');
    }

    const deletedService = await deleteService(supabase, id);

    return { success: true, data: deletedService };
  } catch (error) {
    console.error('Error in deleteServiceAction: ', error);
    return { success: false, error: 'Failed to delete service' };
  }
}
