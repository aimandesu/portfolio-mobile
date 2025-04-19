import {z} from 'zod';
import {FileOrUrlSchema} from './UserSchema';

export const educationSchema = z.object({
  id: z.number().optional(),
  location: z.string().min(1, 'Location is required'),
  level: z.enum(['spm', 'master', 'diploma', 'degree'], {
    required_error: 'Level is required',
  }),
  achievement: z.string().optional(),
  files: FileOrUrlSchema.nullable().optional(),
});

export type EducationClass = z.infer<typeof educationSchema>;
