'use server';

import { unwrap } from '@/lib/utils';
import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from '../../database.types';

export const getAllNotifications = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  return unwrap(
    await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
  );
};

export const getAllUnreadNotifications = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  return unwrap(
    await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('read', false)
      .order('created_at', { ascending: false })
  );
};

export const createNotification = async (
  supabase: SupabaseClient<Database>,
  payload: {
    title: string;
    body: string;
    userId: string;
  }
) => {
  return unwrap(
    await supabase.from('notifications').insert({
      title: payload.title,
      body: payload.body,
      user_id: payload.userId,
    })
  );
};

export const updateNotification = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  notificationId: string,
  payload: Partial<Tables<'notifications'>>
) => {
  return unwrap(
    await supabase
      .from('notifications')
      .update(payload)
      .eq('id', notificationId)
      .eq('user_id', userId)
  );
};
