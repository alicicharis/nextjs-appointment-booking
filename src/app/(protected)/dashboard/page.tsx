import { AppointmentsTable } from '@/components/dashboard/appointments-table';
import { getAllAppointments } from '@/data';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

type Appointment = {
  id: string;
  start_time: string;
  status: string;
  services: {
    title: string;
    price: number;
  };
  customer: {
    id: string;
    username: string | null;
  };
};

const Page = async () => {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user?.user?.id) {
    redirect('/sign-in');
  }

  const appointments = await getAllAppointments(supabase, user.user.id);

  return (
    <div className="col-span-12">
      <AppointmentsTable
        appointments={appointments as Appointment[]}
        role={user.user.user_metadata.role as 'staff' | 'customer'}
      />
    </div>
  );
};

export default Page;
