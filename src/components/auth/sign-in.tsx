'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import { useRef } from 'react';
import { Label } from '@radix-ui/react-label';

export default function SignIn() {
  const supabase = createClient();

  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const signupHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;

    if (!email || !password) return;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log('Data: ', data);
    console.log('Error: ', error);
  };

  return (
    <div className="w-full max-w-md p-6 bg-white shadow-sm">
      <p className="text-xl font-semibold mb-4 text-center">Sign in</p>
      <form onSubmit={signupHandler} className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input type="email" placeholder="Email" ref={emailRef} />
        <Label htmlFor="password">Password</Label>
        <Input
          type="password"
          placeholder="Password"
          className="w-full bg-white"
          ref={passwordRef}
        />
        <Button type="submit">Sign in</Button>
      </form>
    </div>
  );
}
