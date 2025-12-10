import { AppointmentsTable } from '@/components/dashboard/appointments-table';
import { getAllAppointments } from '@/data';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    redirect('/sign-in');
  }

  const { appointments, error } = await getAllAppointments(
    supabase,
    user.user.id
  )
    .then((data) => ({ appointments: data, error: null }))
    .catch((error) => {
      console.error('Error in getAllAppointments: ', error);
      return { appointments: [], error: 'Something went wrong' };
    });

  return (
    <div className="col-span-12">
      <AppointmentsTable
        appointments={appointments || []}
        role={user.user.user_metadata.role as 'staff' | 'customer'}
        error={error}
      />
    </div>
  );
};

export default Page;
