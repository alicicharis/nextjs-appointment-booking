import { User } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isStaffAuthorized(
  user: { user: User | null } | null
): user is { user: User & { id: string; user_metadata: { role: string } } } {
  return !!(user?.user?.id && user.user.user_metadata?.role === 'staff');
}

export function unwrap<T>(res: { data: T; error: any }) {
  if (res.error) {
    const err = new Error(res.error.message);
    (err as any).details = res.error;
    throw err;
  }

  return res.data;
}

export function timeToTimestampz(time: string, date?: string): string {
  const day = date ?? new Date().toISOString().split('T')[0];

  const timeWithSeconds = time.length === 5 ? `${time}:00` : time;

  return `${day}T${timeWithSeconds}.000Z`;
}
