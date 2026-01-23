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

const music = defineCollection({
    type: 'data',
    schema: z.object({
        title: z.string(),
        releaseYear: z.string(),
        duration: z.string(),
        audioUrl: z.string().url(),
    }),
});

const homePage = defineCollection({
    type: 'data',
    schema: z.object({
        headline: z.string(),
        subheadline: z.string(),
    })
});

const aboutPage = defineCollection({
    type: 'content', // MDX content for bio
    schema: z.object({
        title: z.string(),
    })
});

export const collections = {
    'build-logs': buildLogs,
    'music': music,
    'home': homePage,
    'about': aboutPage,
};
