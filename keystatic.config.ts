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
            schema: {
                headline: fields.text({ label: 'Headline' }),
                subheadline: fields.text({ label: 'Subheadline' }),
            }
        }),
        aboutPage: singleton({
            label: 'About Page',
            path: 'src/content/about/index',
            schema: {
                title: fields.text({ label: 'Page Title' }),
                bio: fields.mdx({ label: 'Bio' }),
            }
        })
    }
});
