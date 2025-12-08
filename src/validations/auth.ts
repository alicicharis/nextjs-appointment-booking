import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
  username: z
    .string()
    .min(3, { message: 'Username must be at least 3 characters long' }),
});

export type SignUpSchema = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long' }),
});

export type SignInSchema = z.infer<typeof signInSchema>;
