# Boda Monorepo

Base inicial del proyecto con:

- Backend: Java + Spring Boot + PostgreSQL.
- Frontend: React + Vite + TypeScript.
- Despliegue: Railway con dos servicios Docker separados.
- Experiencia: invitacion de boda virtual responsive con RSVP por token.
- Panel admin: login simple + CRUD de invitados + generación de URL/token + tablero RSVP.

## Estructura

- `backend`: API Spring Boot.
- `frontend`: aplicación web React.

## Variables de entorno

### Backend (`backend/.env`)

Usa `backend/.env.example` como plantilla.

```env
SERVER_PORT=8080
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/boda
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
SPRING_JPA_HIBERNATE_DDL_AUTO=update
CORS_ALLOWED_ORIGINS=http://localhost:5173
APP_SEED_DEMO_ENABLED=true
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_SESSION_SECRET=change-this-secret
ADMIN_SESSION_MINUTES=480
FRONTEND_BASE_URL=http://localhost:5173
```

### Frontend (`frontend/.env`)

Usa `frontend/.env.example` como plantilla.

```env
VITE_API_BASE_URL=http://localhost:8080
```

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
