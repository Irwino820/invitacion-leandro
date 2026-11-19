# Leandro · 2 años · Invitación vaquera

Invitación de una sola página para el segundo cumpleaños de Leandro. Construida con Vite, HTML, CSS y GSAP. La temática es vaquera: papel cálido, óxido, mostaza, salvia y denim, tipografías Fraunces + Nunito Sans, y motivos de sombrero, estrella, herradura, cactus y cuerda.

Evento: **viernes 25 de diciembre de 2026, a partir de las 3:00 p. m.**, en **José García #210, La Estación Rincón**.

La página no incluye confirmación de asistencia, regalos ni código de vestimenta: solo la información del festejo.

## Requisitos

- Node.js 20.19 o superior (recomendado: 22 LTS)
- npm

## Puesta en marcha

```bash
npm install
npm run dev
```

La terminal mostrará la URL local (por defecto `http://localhost:5173`).

```bash
npm run build    # genera dist/
npm run preview  # sirve la versión de producción
```

## Contenido

Casi todo el texto está directamente en `index.html`:

| Elemento | Dónde |
| --- | --- |
| Nombre, edad y frase de portada | `.hero__name`, `.hero__age`, `.hero__lede` |
| Fecha, hora y lugar de la portada | `.hero__facts` |
| Boleto oficial del gran día | `.ticket` |
| Cuenta regresiva y calendario | `.countdown`, `public/cumple-leandro.ics` |
| Cartel «Se busca» y foto opcional | `.wanted` (si agregas `public/leandro.jpg` se muestra automáticamente) |
| Tarjetas de ambiente | `.highlights` |
| Dirección, copiar y mapas | `.place` (Google Maps, Waze y botón copiar) |
| Cierre y compartir | `.footer` |

El enlace **Cómo llegar** es una búsqueda de Google Maps con la dirección José García #210, La Estación Rincón. Sustitúyelo por la ubicación exacta si hace falta.

## Diseño y animaciones

- `src/styles.css`: sistema visual, textura de papel, arte SVG y reglas responsive.
- `src/main.js`: timeline de entrada del hero, apariciones al hacer scroll, cinta vaquera, tumbleweed, cuerda dibujada con DrawSVG y balanceo del letrero.
- Todo el movimiento se desactiva con `prefers-reduced-motion`.

## SEO y Open Graph

`index.html` contiene título, descripción y etiquetas para WhatsApp, Facebook y X:

- `<title>` y `<meta name="description">`
- `og:title`, `og:description`, `og:image:alt`
- `twitter:title`, `twitter:description`
- `public/og.png` (imagen social de 1200 × 630)
- `public/favicon.svg` (estrella con el número 2)

La URL absoluta se inyecta en tiempo de build con `VITE_SITE_URL`:

```bash
cp .env.example .env
```

```dotenv
VITE_SITE_URL=https://tu-dominio.com
```

Sin `https://` y sin barra final. Se usa para `canonical`, `og:url`, `og:image` y `twitter:image`. Reinicia el servidor después de cambiar el archivo `.env`. En producción, Vite mostrará una advertencia si la variable está vacía.

Después de desplegar, refresca la vista previa social con el [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/).

## Despliegue

El proyecto es estático y se puede publicar en Vercel, Netlify, Cloudflare Pages o cualquier hosting que sirva archivos estáticos.

- Build command: `npm run build`
- Output directory: `dist`
- Variable de entorno: `VITE_SITE_URL=https://tu-dominio.com`

## Estructura

```text
public/
  cumple-leandro.ics  Evento de calendario (Apple, Outlook, etc.)
  favicon.svg         Estrella con el número 2
  musica.mp3          Canción de fondo de la invitación
  og.png              Imagen social 1200 × 630
src/
  main.js             Animaciones GSAP, música, cuenta regresiva, compartir y avisos
  styles.css          Sistema visual editorial, responsive e impresión
index.html            Estructura, textos y metadatos
vite.config.js        Inyección de VITE_SITE_URL
```
