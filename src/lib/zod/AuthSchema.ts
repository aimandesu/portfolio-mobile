import {z} from 'zod';

// Combined schema with conditional validation based on form type
export const authSchema = z
  .object({
    // Coerce empty strings to undefined for optional fields
    username: z
      .string()
      .min(1, 'Username is required') // Only checks if not empty
      .min(8, 'Username must be at least 8 characters')
      .optional()
      .or(z.literal('')), // Allow empty string → becomes undefined

    name: z
      .string()
      .min(1, 'Name is required') // Only checks if not empty
      // .min(2, 'Name must be at least 2 characters')
      .optional()
      .or(z.literal('')), // Allow empty string → becomes undefined

    email: z.string().email('Please enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    passwordConfirmation: z.string().optional().or(z.literal('')),
    formType: z.enum(['login', 'signup']),
  })
  .refine(
    data => {
      if (data.formType === 'signup') {
        return !!data.username?.trim(); // Must be non-empty if signup
      }
      return true;
    },
    {
      message: 'Username is required',
      path: ['username'],
    },
  )
  .refine(
    data => {
      if (data.formType === 'signup') {
        return !!data.name?.trim(); // Must be non-empty if signup
      }
      return true;
    },
    {
      message: 'Name is required',
      path: ['name'],
    },
  )
  .refine(
    data => {
      if (data.formType === 'signup') {
        return data.password === data.passwordConfirmation;
      }
      return true;
    },
    {
      message: "Passwords don't match",
      path: ['passwordConfirmation'],
    },
  );

export type AuthFormData = z.infer<typeof authSchema>;
