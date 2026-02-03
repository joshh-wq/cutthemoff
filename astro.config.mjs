// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  site: 'https://defundbillionaires.org',
  adapter: vercel({
    isr: false,
  }),
  vite: {
    define: {
      'process.env.DATABASE_URL': 'process.env.DATABASE_URL',
      'process.env.RESEND_API_KEY': 'process.env.RESEND_API_KEY',
      'process.env.BUTTONDOWN_API_KEY': 'process.env.BUTTONDOWN_API_KEY',
      'process.env.SITE_URL': 'process.env.SITE_URL',
    },
  },
  integrations: [react()],
});
