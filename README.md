# Boda Monorepo

Base inicial del proyecto con:

- Backend: Java + Spring Boot + PostgreSQL.
- Frontend: React + Vite + TypeScript.
- Despliegue: Railway con dos servicios Docker separados.
- Experiencia: invitacion de boda virtual responsive con RSVP por token.
- Panel admin: login simple + CRUD de invitados + generación de URL/token + tablero RSVP.
- CMS admin: gestión de secciones dinámicas de Home + cuentas bancarias para aportes.

## Estructura

- `backend`: API Spring Boot.
- `frontend`: aplicación web React.

## Variables de entorno

### Backend (`backend/.env`)

Usa `backend/.env.example` como plantilla.

El esquema de base de datos se gestiona con **Flyway** (`backend/src/main/resources/db/migration/`). Con `SPRING_JPA_HIBERNATE_DDL_AUTO=validate`, Hibernate no crea tablas: las migraciones SQL son la fuente de verdad.

Migraciones incluidas:

- `V1` — tablas de contenido home y cuentas bancarias
- `V2` — evento global, grupos familiares, invitados y CMS de invitación
- `V3` — migración de datos desde `guest_invitations` (si existe)
- `V4` — elimina la tabla legada `guest_invitations`
- `V5` — historia de amor (settings + entradas por pareja)

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/boda
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=validate
CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_SEED_DEMO_ENABLED=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=change-this-secret
ADMIN_SESSION_MINUTES=480
FRONTEND_BASE_URL=http://localhost:5173
APP_PARTNER_A_USERNAME=esposo
APP_PARTNER_A_PASSWORD=cambiar-esposo
APP_PARTNER_A_DISPLAY_NAME=Daniel
APP_PARTNER_B_USERNAME=esposa
APP_PARTNER_B_PASSWORD=cambiar-esposa
APP_PARTNER_B_DISPLAY_NAME=Ana
```

### Historia de amor

- **Pareja**: `/pareja/login` — cada uno carga sus momentos (fecha, frase, URL de imagen) sin ver el lado del otro.
- **Admin**: `/admin/historia-amor` — activar sección en home, publicar y revisar ambos lados.
- **Público**: la timeline aparece en `/` solo con `enabled` y `published` activos.

### Frontend (`frontend/.env`)

Usa `frontend/.env.example` como plantilla.

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Música ambiental (opcional)

Coloca un archivo `frontend/public/audio/ambient.mp3` para habilitar el botón de música en la invitación personal (`/invitacion/:token`).

### Galería con imágenes

En secciones `gallery`, usa `payloadJson` con items que incluyan `imageUrl` y `alt`:

```json
{"items":[{"title":"Momento","imageUrl":"https://...","alt":"Descripción"}]}
```

### Modelo de datos (familias)

- **Evento global** (`/admin/evento`): fecha, lugares y dress code (una sola fuente para home e invitaciones).
- **Grupos familiares** (`/admin/grupos`): un token por familia con varios miembros (padre, madre, hijos).
- **RSVP**: el invitado marca checkboxes por miembro y envía una sola confirmación.
- **Contenido**: home (`/admin/contenido`) e invitación personal (`/admin/contenido-invitacion`) por separado.

## Ejecucion local

### Backend

```bash
cd backend
./mvnw spring-boot:run
```

Windows PowerShell:

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Endpoints base

- API health: `GET /api/health`
- Actuator health: `GET /actuator/health`
- Validar invitacion por token: `GET /api/invitations/{token}`
- Guardar RSVP: `POST /api/rsvp`

## Endpoints admin

- Login admin: `POST /api/admin/login`
- Listar invitados: `GET /api/admin/guests`
- Crear invitado: `POST /api/admin/guests`
- Editar invitado: `PUT /api/admin/guests/{id}`
- Eliminar invitado: `DELETE /api/admin/guests/{id}`
- Resumen RSVP: `GET /api/admin/rsvp/summary`
- Listar secciones Home: `GET /api/admin/content-sections`
- Crear sección Home: `POST /api/admin/content-sections`
- Actualizar sección Home: `PUT /api/admin/content-sections/{id}`
- Eliminar sección Home: `DELETE /api/admin/content-sections/{id}`
- Reordenar secciones Home: `PATCH /api/admin/content-sections/reorder`
- Listar cuentas bancarias: `GET /api/admin/bank-accounts`
- Crear cuenta bancaria: `POST /api/admin/bank-accounts`
- Actualizar cuenta bancaria: `PUT /api/admin/bank-accounts/{id}`
- Eliminar cuenta bancaria: `DELETE /api/admin/bank-accounts/{id}`
- Reordenar cuentas bancarias: `PATCH /api/admin/bank-accounts/reorder`

## Endpoints públicos de contenido

- Home dinámica: `GET /api/content/home`
- Cuentas bancarias habilitadas: `GET /api/content/bank-accounts`

Todos los endpoints admin, excepto login, requieren:

- Header `Authorization: Bearer <token>`

### Payload RSVP

```json
{
  "token": "demo-token",
  "attending": true,
  "guestCount": 2,
  "dietaryRestrictions": "Vegetariano",
  "message": "Nos vemos en la pista"
}
```

### Token demo para pruebas

- Si `APP_SEED_DEMO_ENABLED=true`, el backend crea automaticamente el invitado `demo-token`.
- Flujo de prueba frontend: `http://localhost:5173/invitacion/demo-token`.

### Acceso al panel admin

- Ruta frontend login: `http://localhost:5173/admin/login`
- Ruta frontend panel: `http://localhost:5173/admin`
- Credenciales por defecto (solo desarrollo): `admin` / `admin123`

Desde el panel puedes:

- crear, editar y eliminar invitados,
- copiar URL personalizada de invitacion por token,
- copiar mensaje listo para WhatsApp,
- ver tablero de confirmaciones (confirmados/no asisten/pendientes/asistentes).
- gestionar secciones de la Home (crear, editar, eliminar, reordenar).
- gestionar cuentas bancarias de aporte (crear, editar, eliminar, reordenar, habilitar/deshabilitar).

### Tipos recomendados de sección para Home

- `hero`
- `countdown` (payload sugerido: `{"targetDateIso":"2026-12-12T16:00:00"}`)
- `highlights` (payload con `items`)
- `story` (payload con `items`)
- `timeline` (payload con `items`)
- `locations` (payload con `items`)
- `gallery` (payload con `items`)
- `generic` (bloque libre con título/subtítulo/cuerpo)

### Aportes bancarios

- Las cuentas bancarias se muestran **solo** en `\u002Finvitacion\u002F:token`.
- No se renderizan en la Home pública.

## Docker

### Build imagen backend

```bash
docker build -t boda-backend ./backend
```

### Build imagen frontend

```bash
docker build -t boda-frontend --build-arg VITE_API_BASE_URL=https://<backend-url> ./frontend
```

## Railway (2 servicios)

### 1) Servicio backend

- Source: este repositorio.
- Root directory: `backend`.
- Builder: Dockerfile.
- Variables requeridas:
  - `SERVER_PORT` (Railway normalmente inyecta `PORT`; si lo prefieres, puedes mapearlo en variables a `SERVER_PORT=${{PORT}}`).
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `SPRING_JPA_HIBERNATE_DDL_AUTO`
  - `CORS_ALLOWED_ORIGINS` (incluye URL del frontend en Railway).
  - `APP_SEED_DEMO_ENABLED` (opcional, solo para demo inicial).
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `ADMIN_SESSION_MINUTES`
  - `FRONTEND_BASE_URL`

### 2) Servicio frontend

- Source: este repositorio.
- Root directory: `frontend`.
- Builder: Dockerfile.
- Variable de build:
  - `VITE_API_BASE_URL=https://<backend-url-publica>`

## Checklist de variables en Railway

- Backend:
  - `SERVER_PORT` (opcional si mapeas `PORT`)
  - `SPRING_DATASOURCE_URL`
  - `SPRING_DATASOURCE_USERNAME`
  - `SPRING_DATASOURCE_PASSWORD`
  - `SPRING_JPA_HIBERNATE_DDL_AUTO`
  - `CORS_ALLOWED_ORIGINS`
  - `APP_SEED_DEMO_ENABLED`
  - `ADMIN_USERNAME`
  - `ADMIN_PASSWORD`
  - `ADMIN_SESSION_SECRET`
  - `ADMIN_SESSION_MINUTES`
  - `FRONTEND_BASE_URL`
- Frontend:
  - `VITE_API_BASE_URL`

## Conexion con repositorio remoto

El remoto `origin` queda configurado a:

- `https://github.com/BackSet/boda.git`

Comandos utiles:

```bash
git remote -v
git add .
git commit -m "chore: bootstrap backend and frontend for railway"
git push -u origin main
```
