import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    images: z.array(z.string()).default([]),
    link: z.string().optional(),
  }),
});

const lab = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    order: z.number().default(0),
    summary: z.string(),
    image: z.string().optional(),
    demo: z.string().optional(),
    doc: z.string().optional(),
  }),
});

export const collections = { projects, lab };
