import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  // Prioridad: VITE_SITE_URL (manual) > dominio de producción de Vercel > URL del despliegue.
  // Vercel expone estas variables sin protocolo (ej. mi-app.vercel.app).
  const vercelHost =
    env.VERCEL_PROJECT_PRODUCTION_URL || env.VERCEL_URL || ''
  const rawSiteUrl =
    env.VITE_SITE_URL || (vercelHost ? `https://${vercelHost}` : '')
  const siteUrl = rawSiteUrl.replace(/\/$/, '')

  if (!siteUrl && mode === 'production') {
    console.warn(
      '[seo] No hay URL absoluta. WhatsApp/Open Graph necesitan una (define VITE_SITE_URL, ej. https://tu-dominio.com).',
    )
  } else if (mode === 'production') {
    console.log(`[seo] URL absoluta para Open Graph: ${siteUrl}`)
  }

  return {
    plugins: [
      {
        name: 'inject-site-url',
        transformIndexHtml(html) {
          // Las URLs absolutas son obligatorias para los rastreadores de WhatsApp / Open Graph.
          return html.replaceAll('%SITE_URL%', siteUrl)
        },
      },
    ],
  }
})
