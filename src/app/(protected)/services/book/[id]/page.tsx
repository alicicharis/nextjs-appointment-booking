import { createClient } from '@/lib/supabase/server';
import { Database, Tables } from '../../../../../../database.types';
import { SupabaseClient } from '@supabase/supabase-js';
import ServicesBookForm from '@/components/services/services-book-form';

const Page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const supabase: SupabaseClient<Database> = await createClient();

  const { data } = await supabase
    .from('services')
    .select(
      `
    *,
    staff_availability (
      id,
      start_time,
      end_time,
      weekday,
      user_id,
      profiles (
        id,
        username
      )
    ),
    appointments (
      id,
      start_time,
      end_time,
      staff_id
    )
  `
    )
    .eq('id', id)
    .single();

  if (!data || !data.staff_availability?.length) {
    return <div>Service not found</div>;
  }

  return (
    <div className="col-span-12">
      <ServicesBookForm
        service={data}
        staffAvailability={
          data.staff_availability.map((avail) => ({
            ...avail,
            profiles: avail.profiles as {
              id: string;
              username: string | null;
            } | null,
          })) as any
        }
        appointments={data.appointments as Tables<'appointments'>[]}
      />
    </div>
  );
};

export default Page;
