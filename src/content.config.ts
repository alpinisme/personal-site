import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const year = z.coerce.string();

const work = defineCollection({
    loader: glob({ pattern: '*.mdx', base: './content/work' }),
    schema: z.object({
        title: z.string(),
        summary: z.string(),
        order: z.number(),
    }),
});

const blog = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/blog' }),
    schema: z.object({
        title: z.string(),
        date: z.coerce.date(),
        description: z.string(),
    }),
});

const course = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/course' }),
    schema: z.object({
        title: z.string(),
        school: z.string(),
        year,
    }),
});

const publication = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/publication' }),
    schema: z.object({
        title: z.string(),
        venue: z.string(),
        year,
        link: z.string().optional(),
        abstract: z.string().nullish(),
    }),
});

const presentation = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/presentation' }),
    schema: z.object({
        title: z.string(),
        occasion: z.string(),
        location: z.string(),
        year,
        month: z.string().nullish(),
        role: z.string().nullish(),
    }),
});

const translation = defineCollection({
    loader: glob({ pattern: '*.md', base: './content/translation' }),
    schema: z.object({
        title: z.string(),
        venue: z.string(),
        year,
        link: z.string().nullish(),
    }),
});

export const collections = {
    work,
    blog,
    course,
    publication,
    presentation,
    translation,
};
