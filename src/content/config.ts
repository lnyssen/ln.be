import { defineCollection, z } from 'astro:content';

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
    order: z.number().default(0),
    tags: z.array(z.string()).default([]),
    // Un visuel s'écrit « - /images/x.jpg » ou, pour lui donner sa
    // description, « - src: /images/x.jpg » suivi de « alt: ce qu'on y voit ».
    images: z
      .array(z.union([z.string(), z.object({ src: z.string(), alt: z.string() })]))
      .default([]),
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

// Les notes : des textes longs, d'abord publiés sur LinkedIn, repris ici en
// entier. `original` renvoie à la première publication.
const notes = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    dek: z.string(),
    date: z.coerce.date(),
    topics: z.array(z.string()).default([]),
    original: z.string().url().optional(),
  }),
});

export const collections = { projects, lab, notes };
