'use server';

import { SupabaseClient } from '@supabase/supabase-js';
import { Database, Tables } from '../../database.types';
import { createClient } from '@/lib/supabase/server';

export const getAllNotifications = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return data;
};

export const getAllUnreadNotifications = async (
  supabase: SupabaseClient<Database>,
  userId: string
) => {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false });

  if (error) {
    console.log('Error getting notifications: ', error);
    return [];
  }
  return data;
};

export const createNotification = async (
  supabase: SupabaseClient<Database>,
  payload: {
    title: string;
    body: string;
    userId: string;
  }
) => {
  const { data, error } = await supabase.from('notifications').insert({
    title: payload.title,
    body: payload.body,
    user_id: payload.userId,
  });
  if (error) {
    throw error;
  }
  return data;
};

export const updateNotification = async (
  notificationId: string,
  payload: Partial<Tables<'notifications'>>
) => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    console.log('User not found');
    return null;
  }

  const { data, error } = await supabase
    .from('notifications')
    .update(payload)
    .eq('id', notificationId)
    .eq('user_id', user.user.id);

  if (error) {
    console.log('Error updating notification: ', error);
    return null;
  }
  return data;
};
