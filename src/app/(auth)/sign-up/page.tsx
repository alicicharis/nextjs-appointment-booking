import SignUp from '@/components/auth/sign-up';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) redirect('/');

  return (
    <main className="flex flex-col items-center justify-center h-screen p-4 bg-gray-100">
      <SignUp />
    </main>
  );
};

export default Page;
