import { defineCollection, z } from 'astro:content';

const buildLogs = defineCollection({
    type: 'content',
    schema: z.object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
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
    type: 'data',
    schema: z.object({
        heroHeadline: z.string(),
        heroSubheadline: z.string(),
        heroImage: z.string().optional(),

        originTitle: z.string(),
        originContent: z.any(),
        originImage: z.string().optional(),

        builderTitle: z.string(),
        builderContent: z.any(),
        builderImage: z.string().optional(),

        strategistTitle: z.string(),
        strategistContent: z.any(),
        strategistImage: z.string().optional(),

        foundationTitle: z.string(),
        foundationContent: z.any(),
        foundationImage: z.string().optional(),
    })
});

export const collections = {
    'build-logs': buildLogs,
    'music': music,
    'home': homePage,
    'about': aboutPage,
};
