# nelson-m.com

Matt Nelson's personal site, built with [Astro](https://astro.build) and deployed on Netlify.

```sh
npm install
npm run dev      # http://localhost:8010
npm run build    # type-checks, then writes the site to dist/
npm run lint
npm run format
```

## Content

- `content/work/`: Panorama posts, as MDX. A post can import a component, as `legend.mdx` does.
- `content/blog/`: writing.
- `content/publication/`, `presentation/`, `translation/`, `course/`: the Research and Teaching pages.

`public/sw.js` retires the old Gatsby service worker. Keep it until returning visitors have had time to pick it up.
