'use server';

import { updateNotification } from '@/data';
import { createClient } from '@/lib/supabase/server';

export const updateNotificationStatus = async (notificationId: string) => {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    console.log('User not found');
    return null;
  }

  const response = await updateNotification(notificationId, { read: true });

  return response;
};
