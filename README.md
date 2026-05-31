# 💬 ChatRoom

Chat en tiempo real multi-canal para red local. Cualquier persona conectada a la misma red WiFi puede unirse, crear canales y chatear sin necesidad de internet ni cuentas.

> Proyecto académico para explorar WebSockets, notificaciones y diseño de interfaces de chat.

---

## ¿Qué hace?

- **Multi-canal:** únete a tantos canales como quieras y cambia entre ellos sin perder el historial
- **Red local (WiFi):** cualquiera en la misma red accede por IP — sin servidores externos
- **Notificaciones toast:** si te escriben en un canal que no estás viendo, aparece una notificación
- **Diseño responsivo:** funciona en escritorio y móvil
- **Colores por usuario:** cada participante tiene un color único generado por su nombre

---

## Stack

| Capa       | Tecnología                          |
|------------|-------------------------------------|
| Frontend   | Next.js 14 · React 18 · TypeScript  |
| Estilos    | Tailwind CSS · NextUI v2            |
| Tiempo real | Socket.io (cliente)                |
| Backend    | Express.js · Socket.io · TypeScript |
| Runtime    | Node.js 20                          |
| Contenedor | Docker · Docker Compose             |

---

## Requisitos

- **Docker** (recomendado) — [instalar Docker](https://docs.docker.com/get-docker/)
- **o** Node.js 18+ — [instalar Node.js](https://nodejs.org)

---

## Inicio rápido

```bash
./run.sh
```

El script hace todo automáticamente:

1. Detecta tu IP local en la red WiFi
2. Crea el archivo `.env` con la IP correcta (si no existe)
3. Muestra las URLs de acceso
4. Arranca los servicios con Docker (o nativamente si Docker no está disponible)

---

## Inicio manual

### Con Docker

```bash
# Primera vez (construye las imágenes)
docker compose up --build

# Siguientes veces
docker compose up

# Detener
docker compose down
```

### Sin Docker

```bash
# Instalar dependencias
cd packages/core && npm install && cd ../..
cd packages/web  && npm install && cd ../..

# Copiar y configurar variables de entorno
cp .env.example .env
# → Edita .env con tu IP (ver sección siguiente)

# Iniciar backend (terminal 1)
cd packages/core && npm run dev

# Iniciar frontend (terminal 2)
cd packages/web && npm run dev
```

---

## Acceso desde otros dispositivos (WiFi)

Para que otros en la misma red puedan conectarse, el `.env` debe tener tu **IP local** (no `localhost`).

### Encontrar tu IP

```bash
# macOS
ipconfig getifaddr en0

# Linux
hostname -I | awk '{print $1}'

# Windows
ipconfig  # busca "IPv4 Address"
```

### Configurar `.env`

```env
# IP desde donde se conecta el navegador al servidor WebSocket
SOCKET_ORIGIN=http://192.168.1.x:3000

# URL que el navegador usa para conectarse al socket
NEXT_PUBLIC_SOCKET_URL=http://192.168.1.x:4000
```

Reemplaza `192.168.1.x` con tu IP real.

### URLs de acceso

| Dispositivo       | URL                          |
|-------------------|------------------------------|
| Tu equipo         | `http://localhost:3000`      |
| Otro en la WiFi   | `http://192.168.1.x:3000`    |

> Si la IP cambia (reinicio del router, nueva red), vuelve a editar `.env` y reinicia los servicios.

---

## Cómo usar el chat

1. Abre `http://localhost:3000` (o la IP de red)
2. Ingresa tu nombre o apodo
3. Haz clic en **"+ Unirse a canal"** en la barra lateral
4. Escribe el nombre del canal (ej: `general`) y únete
5. Escribe mensajes y presiona **Enter** o el botón enviar
6. Para hablar en otro canal, vuelve a hacer clic en **"+ Unirse a canal"**
7. Cambia entre canales desde la barra lateral — los mensajes no leídos se marcan con un badge rojo
8. Si recibes un mensaje en un canal que no estás viendo, aparece una notificación en la esquina superior derecha

---

## Estructura del proyecto

```
chatNotification/
├── run.sh                        # Script de inicio automático
├── docker-compose.yml            # Orquestación de servicios
├── .env.example                  # Plantilla de variables de entorno
│
├── packages/
│   ├── core/                     # Backend (Express + Socket.io)
│   │   ├── src/
│   │   │   └── index.ts          # Servidor WebSocket y rutas
│   │   ├── dist/                 # TypeScript compilado
│   │   └── Dockerfile
│   │
│   └── web/                      # Frontend (Next.js)
│       ├── src/
│       │   ├── app/              # Rutas Next.js (App Router)
│       │   │   ├── layout.tsx    # Layout raíz con providers
│       │   │   ├── page.tsx      # Pantalla de ingreso de username
│       │   │   └── chat/
│       │   │       └── page.tsx  # Página del chat
│       │   ├── modules/
│       │   │   ├── chat/
│       │   │   │   ├── components/   # Burbujas, sidebar, input, etc.
│       │   │   │   └── templates/    # ChatLayout (lógica principal)
│       │   │   └── landing/
│       │   │       └── templates/    # LandingPage (pantalla inicial)
│       │   ├── hooks/
│       │   │   └── useUserColor.ts   # Color determinístico por username
│       │   └── types/
│       │       └── chat.ts           # Interfaces TypeScript del chat
│       └── Dockerfile
```

---

## Variables de entorno

| Variable                  | Servicio | Descripción                                                        |
|---------------------------|----------|--------------------------------------------------------------------|
| `SOCKET_ORIGIN`           | core     | Origen permitido para CORS del servidor WebSocket (URL del frontend) |
| `NEXT_PUBLIC_SOCKET_URL`  | web      | URL del servidor WebSocket a la que se conecta el navegador         |
