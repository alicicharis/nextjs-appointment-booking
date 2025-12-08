import { ServicesList } from '@/components/dashboard/services-list';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Database } from '../../../../database.types';
import { SupabaseClient } from '@supabase/supabase-js';

const Page = async () => {
  const supabase: SupabaseClient<Database> = await createClient();

  const { data: user } = await supabase.auth.getUser();

  console.log('User: ', user);
  if (!user?.user?.id) {
    redirect('/sign-in');
  }

  const userRole = user?.user?.user_metadata?.role || 'customer';

  const { data } =
    userRole === 'staff'
      ? await supabase.from('services').select('*').eq('user_id', user.user.id)
      : await supabase.from('services').select('*');

  console.log('Data: ', data);
  return (
    <div className="col-span-12">
      <ServicesList services={data || []} userRole={userRole} />
    </div>
  );
};

export default Page;
