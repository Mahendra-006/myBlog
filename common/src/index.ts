import { z } from 'zod';

export const authSchema = z.object({
    email: z.string().email(),
    name: z.string().min(1).optional(),
    password: z.string().min(6)
});

export type AuthSchema = z.infer<typeof authSchema>

export const blogSchema = z.object({
    title: z.string().min(1),
    content: z.string().min(1)
});

export type BlogSchema = z.infer<typeof blogSchema>
  
export const updateSchema = blogSchema.extend({
    id: z.string().min(1)
});

export type UpdateSchema = z.infer<typeof updateSchema>

