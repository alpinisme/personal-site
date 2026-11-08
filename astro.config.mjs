import mdx from '@astrojs/mdx';
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://nelson-m.com',
    integrations: [mdx()],
});
