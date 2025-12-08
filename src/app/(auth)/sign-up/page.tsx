import SignUpForm from '@/components/auth/sign-up-form';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

const Page = async () => {
  const supabase = await createClient();

  const { data } = await supabase.auth.getUser();

  if (data?.user) redirect('/');

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-background via-background to-muted/20">
      <div className="w-full max-w-md">
        <SignUpForm />
      </div>
    </main>
  );
};

export default Page;
