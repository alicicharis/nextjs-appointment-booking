import { createClient } from '@/lib/supabase/server';
import { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from 'next/navigation';
import { Database } from '../../../../database.types';
import NotificationsList from '@/components/notifications/notifications-list';
import { getAllNotifications } from '@/data';

const Page = async () => {
  const supabase: SupabaseClient<Database> = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    redirect('/sign-in');
  }

  const notifications = await getAllNotifications(supabase, user.user.id)
    .then((data) => data)
    .catch((error) => {
      console.error('Error in getAllNotifications: ', error);
      return [];
    });

  return (
    <div className="col-span-12">
      <NotificationsList notifications={notifications || []} />
    </div>
  );
};

export default Page;
