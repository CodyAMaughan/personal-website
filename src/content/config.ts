import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const buildLogs = defineCollection({
    loader: glob({ pattern: '**/index.mdoc', base: './src/content/build-logs', generateId: ({ entry }) => entry.replace('/index.mdoc', '').replace('/index', '') }),
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
        tagline: z.string().optional(),
        headline: z.string(),
        headlineHighlight: z.string().optional(),
        subheadline: z.string(),
        heroImage: z.string().optional(),
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
        originImageCaption: z.string().optional(),

        builderTitle: z.string(),
        builderContent: z.any(),
        builderImage: z.string().optional(),
        builderImageCaption: z.string().optional(),

        strategistTitle: z.string(),
        strategistContent: z.any(),
        strategistImage: z.string().optional(),
        strategistImageCaption: z.string().optional(),

        foundationTitle: z.string(),
        foundationContent: z.any(),
        foundationImage: z.string().optional(),
        foundationImageCaption: z.string().optional(),
    })
});

const portfolio = defineCollection({
    loader: glob({
        pattern: '**/*.json',
        base: './src/content/portfolio',
        generateId: ({ entry }) => entry.replace(/\.json$/, ''),
    }),
    schema: z.object({
        title: z.string(),
        description: z.string().optional(),
        muxPlaybackId: z.string().optional(),
        youtubeId: z.string().optional(),
        aspectRatio: z.enum(['16:9', '9:16']).optional(),
        pubDate: z.coerce.date(),
        project: z.enum(['libremotion', 'follow-him-scripture-shorts']),
        featured: z.boolean().optional(),
        scripture: z.string().optional(),
        weekOf: z.coerce.date().optional(),
        profiles: z.array(z.object({
            name: z.string(),
            url: z.string().url(),
        })).optional(),
    }).refine(
        (data) => Boolean(data.muxPlaybackId || data.youtubeId),
        { message: 'Each portfolio entry must include muxPlaybackId or youtubeId.' }
    ),
});

export const collections = {
    'build-logs': buildLogs,
    'music': music,
    'home': homePage,
    'about': aboutPage,
    'portfolio': portfolio,
};
