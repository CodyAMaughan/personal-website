import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
    storage: import.meta.env.PROD
        ? {
            kind: 'github',
            repo: 'CodyAMaughan/personal-website',
        }
        : {
            kind: 'local',
        },
    collections: {
        buildLogs: collection({
            label: 'Build Logs',
            slugField: 'title',
            path: 'src/content/build-logs/*',
            format: { contentField: 'content' },
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                description: fields.text({ label: 'Description' }),
                pubDate: fields.date({ label: 'Publication Date' }),
                tags: fields.array(fields.text({ label: 'Tag' }), {
                    label: 'Tags',
                    itemLabel: props => props.value
                }),
                featured: fields.checkbox({ label: 'Featured', defaultValue: false }),
                content: fields.mdx({
                    label: 'Content',
                    options: {
                        image: {
                            directory: 'public/images/build-logs',
                            publicPath: '/images/build-logs/',
                        }
                    }
                }),
            },
        }),
        music: collection({
            label: 'Music Archive',
            slugField: 'title',
            path: 'src/content/music/*',
            format: 'yaml',
            schema: {
                title: fields.slug({ name: { label: 'Title' } }),
                releaseYear: fields.text({ label: 'Release Year' }), // Using text for simple year input
                duration: fields.text({ label: 'Duration (mm:ss)' }),
                audioUrl: fields.text({ label: 'R2 Public Link', description: 'The direct URL of the audio file hosted on Cloudflare R2' }),
            },
        }),
    },
    singletons: {
        homePage: singleton({
            label: 'Home Page',
            path: 'src/content/home/index',
            format: 'yaml',
            schema: {
                // Hero Section
                tagline: fields.text({ label: 'Tagline', description: 'The small text above the headline (e.g., "Technical Founder & Product Engineer")' }),
                headline: fields.text({ label: 'Headline', description: 'Main headline text' }),
                headlineHighlight: fields.text({ label: 'Headline Highlight', description: 'The gradient-highlighted part of the headline' }),
                subheadline: fields.text({ label: 'Subheadline', description: 'Introduction paragraph below the headline', multiline: true }),
                heroImage: fields.image({
                    label: 'Hero Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
            }
        }),
        aboutPage: singleton({
            label: 'About Page',
            path: 'src/content/about/index',
            format: 'yaml',
            schema: {
                heroHeadline: fields.text({ label: 'Hero Headline' }),
                heroSubheadline: fields.text({ label: 'Hero Subheadline' }),
                heroImage: fields.image({
                    label: 'Hero Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),

                // Section 1: Origin Story
                originTitle: fields.text({ label: 'Section 1 Title' }),
                originContent: fields.markdoc.inline({
                    label: 'Section 1 Content',
                }),
                originImage: fields.image({
                    label: 'Section 1 Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
                originImageCaption: fields.text({ label: 'Section 1 Image Caption', description: 'Optional attribution/caption for the image' }),

                // Section 2: The Builder
                builderTitle: fields.text({ label: 'Section 2 Title' }),
                builderContent: fields.markdoc.inline({
                    label: 'Section 2 Content',
                }),
                builderImage: fields.image({
                    label: 'Section 2 Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
                builderImageCaption: fields.text({ label: 'Section 2 Image Caption', description: 'Optional attribution/caption for the image' }),

                // Section 3: The Strategist
                strategistTitle: fields.text({ label: 'Section 3 Title' }),
                strategistContent: fields.markdoc.inline({
                    label: 'Section 3 Content',
                }),
                strategistImage: fields.image({
                    label: 'Section 3 Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
                strategistImageCaption: fields.text({ label: 'Section 3 Image Caption', description: 'Optional attribution/caption for the image' }),

                // Section 4: The Foundation
                foundationTitle: fields.text({ label: 'Section 4 Title' }),
                foundationContent: fields.markdoc.inline({
                    label: 'Section 4 Content',
                }),
                foundationImage: fields.image({
                    label: 'Section 4 Image',
                    directory: 'public/images',
                    publicPath: '/images/',
                }),
                foundationImageCaption: fields.text({ label: 'Section 4 Image Caption', description: 'Optional attribution/caption for the image' }),
            }
        })
    }
});
