import { User } from '@supabase/supabase-js';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Type guard that checks if a user is authorized as staff
 * @param user - The user data from supabase.auth.getUser()
 * @returns true if user has id and role is 'staff', false otherwise
 */
export function isStaffAuthorized(
  user: { user: User | null } | null
): user is { user: User & { id: string; user_metadata: { role: string } } } {
  return !!(user?.user?.id && user.user.user_metadata?.role === 'staff');
}
