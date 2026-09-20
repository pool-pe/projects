# 🎤 ARMY Pass — Clon de app de conciertos (BTS WORLD TOUR 'ARIRANG' · Lima)

Réplica de la sección de entradas de una app de tickets, medida pixel a pixel sobre
capturas y un video de la app original. La app es **solo eso**: login y entradas.

Pantallas:

1. **Mis Entradas** — lista agrupada por mes con el afiche del evento.
2. **Detalle de entrada** — carrusel de pases con QR dinámico, banda de fecha y los
   datos de acceso (tarifa, sección, fila, asiento, hora de inicio).
3. **Transferencia** — seleccionar entradas → elegir método (Contactos Frecuentes,
   Quentro ID o Vía E-mail) → confirmar con el correo del destinatario.

Evento de la demo: **BTS WORLD TOUR 'ARIRANG'** — Estadio San Marcos, Lima
(miércoles 7 de octubre de 2026, 20:00 h · 4 entradas en Tribuna Sur, fila 12,
asientos 101 a 104).

> **Stack:** React 19 + Vite 8 + Tailwind CSS 4 + lucide-react + React Router 7 ·
> Backend opcional en Node.js/Express 5 con base de datos JSON.

---

## 📑 Índice

1. [Requisitos previos](#1-requisitos-previos)
2. [Instalación rápida](#2-instalación-rápida)
3. [Cómo ejecutar el proyecto](#3-cómo-ejecutar-el-proyecto)
4. [📱 Vista previa desde tu celular](#4--vista-previa-desde-tu-celular)
5. [Credenciales de demostración](#5-credenciales-de-demostración)
6. [Estructura de carpetas](#6-estructura-de-carpetas)
7. [Crear el proyecto desde cero (paso a paso)](#7-crear-el-proyecto-desde-cero-paso-a-paso)
8. [API REST del backend](#8-api-rest-del-backend)
9. [Personalización](#9-personalización)
10. [Solución de problemas](#10-solución-de-problemas)

---

## 1. Requisitos previos

| Herramienta | Versión mínima | Comprobar con |
|---|---|---|
| Node.js | **20.19** o superior (recomendado 22 LTS) | `node -v` |
| npm | 10 o superior | `npm -v` |

> Vite 8 **no funciona** con Node 18. Si tienes una versión antigua, instala Node 22 desde
> [nodejs.org](https://nodejs.org) o con `nvm install 22 && nvm use 22`.

---

## 2. Instalación rápida

```bash
# 1. Entra a la carpeta del proyecto
cd bts-concert-app

# 2. Instala las dependencias (frontend + backend)
npm install
```

Eso es todo: no hace falta configurar nada más. El archivo `.env` es **opcional**
(hay un `.env.example` con los valores por defecto).

---

## 3. Cómo ejecutar el proyecto

Tienes tres formas de arrancarlo según lo que necesites:

### Opción A — Solo frontend (la más simple)

```bash
npm run dev
```

Abre **http://localhost:5173**

La app detecta que no hay backend y entra en **modo demo**: los datos salen de
`src/data/mockDb.js` y los usuarios registrados se guardan en `localStorage`.
En el header verás una etiqueta ámbar que dice `Demo`.

### Opción B — Frontend + API Express (recomendado)

```bash
npm run dev:all
```

Levanta las dos cosas a la vez:

| Servicio | URL |
|---|---|
| Frontend (Vite) | http://localhost:5173 |
| API (Express) | http://localhost:4000/api/health |

Ahora el header muestra una etiqueta verde `API`: las contraseñas se validan
con **scrypt** contra `server/db.json` y las sesiones usan tokens `Bearer` reales.

### Opción C — Cada servicio en su terminal

```bash
# Terminal 1 — backend
npm run api

# Terminal 2 — frontend accesible desde la red local
npm run dev -- --host
```

### Todos los scripts disponibles

| Script | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo de Vite (puerto 5173) |
| `npm run dev:host` | Igual, forzando la exposición en la red Wi-Fi |
| `npm run api` | Solo la API Express (puerto 4000) |
| `npm run dev:all` | API + frontend en paralelo, con la red expuesta |
| `npm run build` | Compila a producción en `dist/` |
| `npm run preview` | Sirve el build compilado (puerto 4173) |
| `npm run seed` | Regenera `server/db.json` desde `server/seed.json` |
| `npm run seed:build` | Regenera `server/seed.json` desde `src/data/mockDb.js` |

### Publicar un build estático

Para subir la app a un hosting estático (GitHub Pages, Netlify, un visor con
sandbox…) donde no hay servidor que reescriba las rutas:

```bash
VITE_ROUTER=hash npx vite build --base ./ --outDir dist-artifact
```

- `VITE_ROUTER=hash` cambia las rutas a `/#/tickets`, que funcionan sin
  configuración del servidor.
- `--base ./` deja las rutas de los assets relativas, para servir la app desde
  una subcarpeta.

Sin backend, ese build corre en modo demo con los datos de `src/data/mockDb.js`.

---

## 4. 📱 Vista previa desde tu celular

La app está pensada para verse en el teléfono. Sigue estos pasos:

### Paso 1 — Conecta ambos dispositivos a la MISMA red Wi-Fi

La PC y el celular deben estar en la misma red. **No funciona** si el celular
está usando datos móviles o una red de invitados aislada.

### Paso 2 — Arranca el servidor exponiendo la red

```bash
npm run dev -- --host
```

> El `-- --host` pasa el flag a Vite. Como en `vite.config.js` ya está
> `server: { host: true }`, también basta con `npm run dev`. El flag se mantiene en
> la documentación porque es lo que verás en la mayoría de tutoriales.

### Paso 3 — Copia la dirección **Network**

Vite imprime algo así:

```
  VITE v8.3.0  ready in 367 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.1.35:5173/     ← ESTA es la que necesitas
```

Si no aparece la línea `Network`, busca tu IP local a mano:

| Sistema | Comando | Qué buscar |
|---|---|---|
| Windows | `ipconfig` | “Dirección IPv4” del adaptador Wi-Fi |
| macOS | `ipconfig getifaddr en0` | La IP que imprime |
| Linux | `hostname -I` | La primera IP de la lista |

Casi siempre empieza por `192.168.x.x` o `10.0.x.x`.

### Paso 4 — Abre esa URL en el navegador del celular

Escribe en Chrome/Safari del teléfono:

```
http://192.168.1.35:5173
```

(reemplaza la IP por la tuya). ¡Listo! Verás la app con la barra de navegación
inferior, el banner del evento y tu entrada con QR.

### Paso 5 (opcional) — Instálala como app

En Chrome Android: menú ⋮ → **Agregar a pantalla de inicio**.
En Safari iOS: botón Compartir → **Añadir a pantalla de inicio**.
Se abrirá a pantalla completa, como una app nativa.

### ⚠️ Si el celular no carga la página

Casi siempre es el **firewall de tu PC** bloqueando el puerto 5173:

<details>
<summary><b>Windows</b></summary>

La primera vez que arrancas Node, Windows muestra un aviso: marca
**“Redes privadas”** y acepta. Si lo rechazaste, ejecuta PowerShell como
administrador:

```powershell
New-NetFirewallRule -DisplayName "Vite Dev 5173" -Direction Inbound -LocalPort 5173 -Protocol TCP -Action Allow
```
</details>

<details>
<summary><b>macOS</b></summary>

Ajustes del Sistema → Red → Firewall → Opciones → permitir conexiones entrantes
para **node**.
</details>

<details>
<summary><b>Linux (ufw)</b></summary>

```bash
sudo ufw allow 5173/tcp
```
</details>

> **Sobre la API:** el celular **nunca** habla directo con el puerto 4000. El frontend
> pide `/api/...` al servidor de Vite y el **proxy** configurado en `vite.config.js`
> lo reenvía a `http://localhost:4000`. Por eso no tienes que cambiar ninguna IP
> en el código para que el backend funcione desde el teléfono.

---

## 5. Credenciales de demostración

```
Correo:      jeanpierre@army.pe
Contraseña:  bts2026
```

En la pantalla de login hay un botón **“Cuenta de demostración”** que autocompleta
el formulario con un toque. También puedes:

- **Crear una cuenta nueva** desde la pestaña “Crear cuenta” (queda guardada en el
  backend o en `localStorage` según el modo).
- **Entrar con Google / Apple / Kakao** — son botones simulados que inician sesión
  con el usuario demo.

La sesión se guarda en `localStorage` bajo la clave `bts.session`, así que sobrevive
a recargas y a cerrar el navegador.

---

## 6. Estructura de carpetas

```
bts-concert-app/
├── index.html                  # HTML raíz (incluye el script anti-parpadeo del tema)
├── vite.config.js              # host: true + proxy /api -> localhost:4000
├── package.json
├── .env.example
│
├── public/
│   ├── favicon.svg
│   └── posters/
│       └── bts-arirang.jpg     # Afiche oficial del evento (768x1080)
│
├── src/
│   ├── main.jsx                # Punto de entrada de React
│   ├── App.jsx                 # Providers + rutas
│   ├── index.css               # Tailwind v4: tokens, modo oscuro, utilidades
│   │
│   ├── context/
│   │   ├── AuthContext.jsx     # Sesión persistida en localStorage
│   │   ├── DataContext.jsx     # Evento, entradas y notificaciones
│   │   ├── ThemeContext.jsx    # Modo claro/oscuro por clase .dark
│   │   └── ToastContext.jsx    # Notificaciones flotantes
│   │
│   ├── hooks/
│   │   └── useRotatingToken.js # Token del QR que rota cada 30 s
│   │
│   ├── lib/
│   │   ├── api.js              # Cliente HTTP con fallback offline
│   │   ├── env.js              # resolveAsset(): rutas según el base del build
│   │   └── format.js           # Fechas, moneda e iniciales en es-PE
│   │
│   ├── data/
│   │   └── mockDb.js           # Fuente de verdad de los datos simulados
│   │
│   ├── components/
│   │   ├── ui/                 # Button, Card, Modal
│   │   ├── AppShell.jsx        # Estados de carga y error de la zona privada
│   │   ├── Login.jsx           # Login + registro + social
│   │   ├── MyTicketsHeader.jsx # Cabecera de "Mis Entradas" (réplica medida)
│   │   ├── ScreenHeader.jsx    # Cabecera de las pantallas apiladas
│   │   ├── TicketListItem.jsx  # Fila de la lista con afiche (réplica medida)
│   │   ├── TicketPassCard.jsx  # Tarjeta blanca de la entrada con QR
│   │   ├── ProtectedRoute.jsx
│   │   └── ThemeToggle.jsx
│   │
│   └── pages/
│       ├── LoginPage.jsx
│       ├── TicketsPage.jsx         # "Mis Entradas"
│       ├── TicketDetailPage.jsx    # Detalle con el QR
│       ├── TransferSelectPage.jsx  # "Seleccionar entradas"
│       ├── TransferMethodPage.jsx  # "Transferir entrada"
│       ├── TransferEmailPage.jsx   # "Vía E-mail"
│       └── NotFoundPage.jsx
│
└── server/                     # API mock (opcional)
    ├── index.js                # Servidor Express
    ├── db.js                   # Lectura/escritura JSON + scrypt + sesiones
    ├── seed.json               # Datos semilla (generado desde src/data/mockDb.js)
    ├── build-seed.js           # npm run seed:build
    ├── reset-db.js             # npm run seed
    ├── middleware/auth.js      # Verificación del token Bearer
    └── routes/
        ├── auth.js             # register / login / social / me / logout
        └── catalog.js          # bootstrap / events / tickets / purchases…
```

---

## 7. Crear el proyecto desde cero (paso a paso)

Si prefieres construirlo tú mismo en lugar de clonar esta carpeta, estos son los
comandos exactos:

```bash
# 1. Crear el proyecto con Vite + React
npm create vite@latest bts-concert-app -- --template react
cd bts-concert-app

# 2. Dependencias del frontend
npm install
npm install tailwindcss @tailwindcss/vite
npm install lucide-react react-router-dom qrcode.react

# 3. Dependencias del backend (opcional)
npm install --save-dev express cors concurrently

# 4. Crear la estructura de carpetas
mkdir -p src/components/ui src/context src/hooks src/lib src/data src/pages
mkdir -p server/routes server/middleware
```

**5. Configurar Tailwind CSS 4** — en Tailwind v4 **ya no existe `tailwind.config.js`**
ni hace falta `npx tailwindcss init`. Se configura en dos sitios:

`vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,          // expone la app en la red Wi-Fi local
    port: 5173,
    proxy: { '/api': { target: 'http://localhost:4000', changeOrigin: true } },
  },
})
```

`src/index.css` (reemplaza todo su contenido):

```css
@import 'tailwindcss';

/* Modo oscuro por clase .dark en <html> en lugar de por preferencia del sistema */
@custom-variant dark (&:where(.dark, .dark *));

@theme {
  --color-brand-500: #854df5;
  /* …resto de tokens… */
}
```

**6. Borra `src/App.css`** (no se usa) y copia los archivos de `src/` y `server/`
de este repositorio.

**7. Añade los scripts** a `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "dev:host": "vite --host",
    "api": "node server/index.js",
    "dev:all": "concurrently -n \"API,WEB\" -c \"magenta,cyan\" \"npm:api\" \"npm:dev:host\"",
    "build": "vite build",
    "preview": "vite preview --host",
    "seed": "node server/reset-db.js"
  }
}
```

> ⚠️ El backend usa `import`/`export`, así que `package.json` debe incluir
> `"type": "module"`.

---

## 8. API REST del backend

Base: `http://localhost:4000/api` (o `/api` a través del proxy de Vite).

| Método | Ruta | Auth | Descripción |
|---|---|:--:|---|
| `GET` | `/health` | — | Estado del servidor |
| `POST` | `/auth/register` | — | Crea una cuenta (`{ name, email, password }`) |
| `POST` | `/auth/login` | — | Inicia sesión (`{ email, password }`) |
| `POST` | `/auth/social` | — | Login social simulado (`{ provider }`) |
| `GET` | `/auth/me` | ✅ | Usuario de la sesión actual |
| `POST` | `/auth/logout` | ✅ | Invalida el token |
| `GET` | `/bootstrap` | ✅ | Evento + entradas + compras + guía + avisos |
| `GET` | `/events/featured` | — | Evento destacado |
| `GET` | `/tickets` | ✅ | Entradas del usuario |
| `GET` | `/tickets/:id` | ✅ | Detalle de una entrada |
| `GET` | `/tickets/:id/validation` | ✅ | Nonce rotatorio para el QR |
| `GET` | `/purchases` | ✅ | Historial de compras |
| `GET` | `/guide` | — | Guía del día del concierto |
| `GET` | `/notifications` | ✅ | Notificaciones |
| `PATCH` | `/users/me/preferences` | ✅ | Actualiza preferencias |

Las rutas con ✅ requieren la cabecera `Authorization: Bearer <token>`.

Ejemplo:

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"jeanpierre@army.pe","password":"bts2026"}'
```

**Notas de seguridad (es una demo, pero hecha con criterio):**
las contraseñas se guardan con `scrypt` + salt aleatoria, nunca en texto plano;
la comparación usa `timingSafeEqual`; y el hash jamás sale en las respuestas.

---

## 9. Personalización

| Qué quieres cambiar | Dónde |
|---|---|
| Fecha, hora, recinto o ciudad del evento | `src/data/mockDb.js` → `FEATURED_EVENT` y `server/seed.json` → `events[0]` |
| Datos de la entrada (zona, puerta, asiento) | `src/data/mockDb.js` → `TICKETS` y `server/seed.json` → `tickets` |

| Colores de marca | `src/index.css` → bloque `@theme` (`--color-brand-*`, `--color-accent-*`) |
| Usuario demo y su contraseña | `src/data/mockDb.js` → `DEMO_USER` y `server/seed.json` → `users[0]` |
| Cada cuánto rota el QR | `src/components/TicketPassCard.jsx` → `useRotatingToken(ticket.id, 30)` |
| Afiche del evento | Deja tu imagen en `public/posters/` y apunta `poster` de `FEATURED_EVENT` a ella (ej. `/posters/mi-afiche.jpg`) |
| Sección, fila y asientos | `src/data/mockDb.js` → `COMMON.section`, `COMMON.row` y el `seat` de cada entrada |
| Entradas transferidas | Se guardan en `localStorage` bajo `bts.transferred`; el enlace "Deshacer la transferencia" de la lista vacía las devuelve |
| Medidas de las pantallas replicadas | `src/components/MyTicketsHeader.jsx`, `TicketListItem.jsx` y `TicketPassCard.jsx` (los comentarios indican de dónde sale cada valor) |

La fuente de verdad de los datos es `src/data/mockDb.js`. Tras editarlo:

```bash
npm run seed:build   # regenera server/seed.json desde mockDb.js
npm run seed         # regenera server/db.json desde seed.json
```

> La cuenta regresiva usa la fecha real del sistema. Si pones una fecha pasada, el
> banner muestra “¡El show ya comenzó!” en lugar del contador.

---

## 10. Solución de problemas

<details>
<summary><b>“Port 5173 is already in use”</b></summary>

Ya hay un Vite corriendo. Ciérralo o cambia el puerto en `vite.config.js`.
Para matarlo: `npx kill-port 5173` (o `lsof -ti:5173 | xargs kill` en macOS/Linux).
</details>

<details>
<summary><b>El celular no abre la página</b></summary>

1. Verifica que ambos estén en la misma Wi-Fi.
2. Revisa el firewall (ver [paso 4](#️-si-el-celular-no-carga-la-página)).
3. Usa `http://`, no `https://`.
4. Confirma que Vite imprimió la línea `Network:`.
</details>

<details>
<summary><b>El header dice “Demo” y no “API”</b></summary>

El backend no está corriendo. Arráncalo con `npm run api` o usa `npm run dev:all`.
No es un error: la app funciona igual, solo que con datos locales.
</details>

<details>
<summary><b>Los estilos no se aplican</b></summary>

Comprueba que `src/main.jsx` importa `./index.css` y que `vite.config.js` incluye el
plugin `tailwindcss()`. En Tailwind v4 **no** se usa `tailwind.config.js` ni PostCSS.
</details>

<details>
<summary><b>“Correo o contraseña incorrectos” con las credenciales demo</b></summary>

Si editaste `server/seed.json`, regenera la base: `npm run seed`.
</details>

<details>
<summary><b>Las tipografías se ven distintas</b></summary>

Outfit e Inter se cargan desde Google Fonts. Sin internet, el navegador usa la
fuente del sistema: la app sigue funcionando, solo cambia la tipografía.
</details>

---

## 📄 Aviso legal

Proyecto **educativo y de demostración**. No está afiliado, patrocinado ni avalado por
BIGHIT MUSIC, HYBE, BTS ni por ninguna ticketera. Todos los datos (evento, entradas,
precios, usuarios) son ficticios. Los nombres y marcas mencionados pertenecen a sus
respectivos titulares.

El afiche de `public/posters/bts-arirang.jpg` es material promocional de terceros: si
vas a publicar este proyecto, reemplázalo por una imagen propia o con licencia.

Nota sobre cómo se muestra: el afiche es vertical (768×1080). En el detalle se muestra
en su proporción real, sin deformar; en las miniaturas de la lista y de la selección se
recorta al centro (`object-cover`) para que nada se vea ensanchado.
