import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const siteUrl = (env.VITE_SITE_URL || '').replace(/\/$/, '')

  if (!siteUrl && mode === 'production') {
    console.warn(
      '[seo] VITE_SITE_URL is empty. WhatsApp/Open Graph previews need an absolute URL (e.g. https://tu-dominio.com).',
    )
  }

  return {
    server: {
      headers: {
        'Permissions-Policy': 'autoplay=*',
      },
    },
    preview: {
      headers: {
        'Permissions-Policy': 'autoplay=*',
      },
    },
    plugins: [
      {
        name: 'inject-site-url',
        transformIndexHtml(html) {
          // Absolute URLs are required for WhatsApp / Open Graph crawlers.
          return html.replaceAll('%SITE_URL%', siteUrl)
        },
      },
    ],
  }
})
