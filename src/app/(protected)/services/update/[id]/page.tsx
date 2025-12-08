import ServicesUpdateForm from '@/components/services/services-update-form';
import { createClient } from '@/lib/supabase/server';
import { Database } from '../../../../../../database.types';
import { SupabaseClient } from '@supabase/supabase-js';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const supabase: SupabaseClient<Database> = await createClient();

  const { data } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (!data) {
    return <div>Service not found</div>;
  }

  return (
    <>
      <ServicesUpdateForm service={data} />
    </>
  );
};

export default Page;
