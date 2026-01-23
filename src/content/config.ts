import { defineCollection, z } from 'astro:content';

const buildLogs = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.string(), // Using string for simple date handling or coerce.date()
        featured: z.boolean().optional(),
    }),
});

export const collections = {
    'build-logs': buildLogs,
};
