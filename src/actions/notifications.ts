'use server';

import { updateNotification } from '@/data';
import { createClient } from '@/lib/supabase/server';

export const updateNotificationStatusAction = async (
  notificationId: string
) => {
  try {
    const supabase = await createClient();

    const { data: user } = await supabase.auth.getUser();

    if (!user?.user?.id) {
      throw new Error('User not found');
    }

    const updatedNotification = await updateNotification(
      supabase,
      user.user.id,
      notificationId,
      { read: true }
    );

    return { success: true, data: updatedNotification };
  } catch (error) {
    console.error('Error in updateNotificationStatusAction: ', error);
    return { success: false, error: 'Failed to update notification status' };
  }
};
