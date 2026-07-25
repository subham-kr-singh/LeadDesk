import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long' }),
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  budgetRange: z.string().min(1, { message: 'Please select a budget range' }),
  message: z.string().trim().min(10, { message: 'Message must be at least 10 characters long' }),
});

export type LeadFormData = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

export type LoginFormData = z.infer<typeof loginSchema>;
