// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://lubricants-demo.vercel.app',
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
  ],
  vite: {
    optimizeDeps: {
      include: ['@astrojs/image/components'],
    },
  },
  build: {
    inlineStylesheets: 'always',
  },
});
