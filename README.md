# Entradas del evento — versión React + Vite

Migración de la app estática (HTML/CSS/JS) a React con Vite. Misma funcionalidad exacta, mismo diseño, mismo `dataLayer.js` (modo prueba / Firebase), solo reestructurado como componentes.

**Versiones (actualizadas a julio 2026):** React 19.2.8 · Vite 8.1.5 · react-router-dom 7.18.1 · firebase 12.16.0 · qrcode.react 4.2.0 · html5-qrcode 2.3.8.

## Instalar y correr

```bash
npm install
npm run dev
```

Abre la URL que te muestra la terminal (normalmente `http://localhost:5173`). Las 3 páginas ahora son rutas de una sola app:

- `/` → Ingreso (login + tabs de días + tickets)
- `/staff` → Escáner del staff
- `/admin` → Panel de carga de personas

## Compilar para producción

```bash
npm run build
```

Esto genera la carpeta `dist/` — eso es lo que subes a Vercel (o cualquier hosting estático). Con `npm run preview` puedes revisar cómo queda ese build antes de publicarlo.

## Qué cambió respecto a la versión anterior

| Antes (HTML/JS plano) | Ahora (React) |
|---|---|
| `ingreso.html` + `ingreso.js` + `ingreso.css` | `src/pages/Ingreso.jsx` + `src/styles/ingreso.css` |
| `staff.html` + `staff.js` + `staff.css` | `src/pages/Staff.jsx` + `src/styles/staff.css` |
| `admin.html` + `admin.js` + `admin.css` | `src/pages/Admin.jsx` + `src/styles/admin.css` |
| Firebase cargado por CDN (`<script>` dinámico) | Firebase como paquete npm (`firebase/app`, `firebase/firestore`) |
| QR generado con `qrcodejs` (CDN) | QR generado con `qrcode.react` (npm) |
| Imágenes/video en `src/` (carpeta del proyecto) | Imágenes/video en `public/media/` |
| Fuentes en `fonts/` | Fuentes en `public/fonts/` |

**`dataLayer.js`, `config.js` y `mockData.js` mantienen exactamente la misma lógica** — solo se ajustaron los imports de Firebase (de dinámico/CDN a estático/npm) y las rutas de imágenes en `config.js` (de `"src/..."` a `"/media/..."`, porque así es como Vite sirve la carpeta `public/`).

## Assets pendientes de subir

Copia tus archivos reales a estas rutas (los nombres deben coincidir con lo que dice `src/config.js`):

```
public/media/dia1.jpg
public/media/dia2.jpg
public/media/intro.mp4
public/media/fondo-intro.jpg
public/media/promo.jpg
public/media/fondo-login.jpg   ← ya está incluido de ejemplo
public/media/logo-login.png
```

Las fuentes ya están todas incluidas y funcionando:
```
public/fonts/TuskerGrotesk-4700Bold.woff2   ✓ incluido (el que subiste)
public/fonts/Montserrat-Light.woff2         ✓ incluido (descargada del repo oficial de Google Fonts)
public/fonts/Montserrat-Bold.woff2          ✓ incluido (descargada del repo oficial de Google Fonts)
```
Como Montserrat es una fuente open source de Google, la descargué directo del repositorio oficial (`github.com/google/fonts`) y extraje las instancias estáticas Light (300) y Bold (700) de la fuente variable — no tuviste que subir nada. Por esto mismo, quité a Montserrat del `<link>` de Google Fonts en `index.html` (ya no hace falta, y tenerla en dos lugares a la vez causaba conflictos de renderizado). JetBrains Mono se sigue cargando desde Google Fonts normalmente.

## Configuración (Firebase, PINs, datos del evento)

Todo sigue en un solo archivo: **`src/config.js`**. Mismo `MODO_PRUEBA`, mismo `firebaseConfig`, mismo `EVENTO`, mismos `STAFF_PINS` — solo cambia dónde vive el archivo.

## Reglas de Firestore

Exactamente las mismas que ya tienes publicadas en la consola de Firebase (colecciones `preregistros`, `tickets`, `ticketIndex`, `stats`). No hay que tocar nada ahí — React solo cambia cómo se construye el frontend, no cómo se habla con Firestore.

## Publicar en Vercel

1. Sube esta carpeta a un repo de Git (recomendado) o directo por CLI de Vercel.
2. Vercel detecta automáticamente que es un proyecto Vite. Configuración por defecto:
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
3. Como ahora es una sola app con rutas (`/`, `/staff`, `/admin`) en vez de 3 archivos HTML sueltos, asegúrate de compartir los links así: `tu-dominio.vercel.app/staff`, `tu-dominio.vercel.app/admin`, etc.

## Nota sobre el tamaño del build

Vite avisa que el bundle final (~628 KB sin comprimir, ~194 KB gzip) es más grande de lo ideal — es normal, porque ahora incluye el SDK completo de Firebase y React empaquetados. No afecta la funcionalidad; si más adelante quieres optimizarlo, se puede dividir en carga diferida (`import()` dinámico) por ruta.
