import { defineCollection, z } from 'astro:content';

const casesCollection = defineCollection({
  type: 'data',
  schema: z.object({
    id: z.string(),
    title: z.string(),
    clientName: z.string(),
    tags: z.array(z.string()),
    shortDescription: z.string().max(180).default(''),
    problemDescription: z.string(),
    technicalSolution: z.string(),
    businessOutcome: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        unit: z.string()
      })
    ),
    liveUrl: z.string().url(),
    projectType: z.enum(['SaaS', 'Client-Work', 'Open-Source']),
    featured: z.boolean().default(false)
  })
});

export const collections = {
  'cases': casesCollection,
};
