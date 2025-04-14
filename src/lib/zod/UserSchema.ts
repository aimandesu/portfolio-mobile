import {z} from 'zod';

const FileOrUrlSchema = z.union([
  z.string().startsWith('file://'), // local
  z.string(), // any remote string (e.g., filename or URL)
]);

export const UserSchema = z.object({
  username: z.string(),
  id: z.number(),
  name: z.string(),
  age: z.number().nullable().optional(),
  title: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  image: FileOrUrlSchema.nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string(),
  resume: FileOrUrlSchema.nullable().optional(),
});

export type ProfileClass = z.infer<typeof UserSchema>;
