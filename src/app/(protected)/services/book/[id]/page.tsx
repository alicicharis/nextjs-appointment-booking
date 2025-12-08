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

  console.log('Data: ', data);

  if (!data) {
    return <div>Service not found</div>;
  }
  return (
    <div className="col-span-12">
      <h1 className="text-2xl font-bold">Book Service</h1>
    </div>
  );
};

export default Page;
