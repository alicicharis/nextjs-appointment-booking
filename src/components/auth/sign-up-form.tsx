'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { SignUpSchema, signUpSchema } from '@/validations';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Switch } from '@/components/ui/switch';

export default function SignUForm() {
  const supabase = createClient();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isBusiness, setIsBusiness] = useState<boolean>(false);

  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const submitHandler = async (payload: SignUpSchema) => {
    const { data } = await supabase.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          username: payload.username,
          role: isBusiness ? 'staff' : 'customer',
        },
      },
    });

    if (data?.user) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-card border border-border rounded-xl shadow-lg p-8 space-y-6">
        {/* Header */}
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-muted-foreground">
            Sign up to get started with your account
          </p>
        </div>

        {/* Success Message */}
        {form.formState.isSubmitSuccessful && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm">
            <CheckCircle2 className="size-4 shrink-0" />
            <span>Account created successfully! Redirecting...</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-5">
          {/* Username Field */}
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="username"
                type="text"
                placeholder="johndoe"
                className="pl-10 h-11"
                minLength={3}
                {...form.register('username')}
              />
            </div>
          </div>

          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="email"
                type="email"
                placeholder="name@example.com"
                className="pl-10 h-11"
                {...form.register('email')}
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="At least 6 characters"
                className="pl-10"
                minLength={6}
                {...form.register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground">
              Password must be at least 6 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="isBusiness" className="text-sm font-medium">
              I'm business owner or staff member
            </Label>
            <Switch
              className="ml-auto"
              checked={isBusiness}
              onCheckedChange={setIsBusiness}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-11 text-base font-medium"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Creating account...
              </>
            ) : (
              'Sign up'
            )}
          </Button>
        </form>

        {/* Sign In Link */}
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link
            href="/sign-in"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
