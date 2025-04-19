import {z} from 'zod';

const RNFileSchema = z.object({
  uri: z.string(),
  type: z.string(),
  name: z.string(),
});

export const FileOrUrlSchema = z.union([
  RNFileSchema, // Local picked file
  z.string(), // Remote URL (string from backend)
]);

export const UserSchema = z.object({
  username: z.string(),
  id: z.number(),
  name: z.string(),
  age: z.union([z.string(), z.number()]).nullable().optional(),
  title: z.string().nullable().optional(),
  about: z.string().nullable().optional(),
  location: z.string().nullable().optional(),
  image: FileOrUrlSchema.nullable().optional(),
  address: z.string().nullable().optional(),
  email: z.string(),
  resume: FileOrUrlSchema.nullable().optional(),
});

export type ProfileClass = z.infer<typeof UserSchema>;
