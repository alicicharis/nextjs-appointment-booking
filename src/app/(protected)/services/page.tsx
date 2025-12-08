import { ServicesList } from '@/components/dashboard/services-list';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Database } from '../../../../database.types';
import { SupabaseClient } from '@supabase/supabase-js';

const Page = async () => {
  const supabase: SupabaseClient<Database> = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    redirect('/sign-in');
  }

  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('user_id', user.user.id);

  return (
    <div className="col-span-12">
      <ServicesList services={data || []} />
    </div>
  );
};

export default Page;
