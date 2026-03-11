# RUDRATEK-BACKEND

RUDRATEK-BACKEND is a secure REST API for a multi-tenant project management module. It is built with Node.js and Express, uses JWT for authentication, validates incoming payloads, and enforces ownership rules so a user can only manage their own projects inside their tenant.

## What The API Does

This service provides:

- user registration and login
- JWT-based protected routes
- CRUD operations for projects
- tenant-aware project ownership
- request validation for auth and project payloads
- modular structure with separated routes, controllers, services, and middleware
- local JSON-backed persistence for simple setup and demo use

## Main Features

### Authentication

- Users can register with `name`, `email`, `password`, and `tenantId`
- Passwords are hashed with `bcryptjs`
- Successful login returns a signed JWT
- Protected routes require `Authorization: Bearer <token>`

### Project Management

Each project stores:

- `title`
- `description`
- `status`
- `ownerId`
- `tenantId`

Supported actions:

- create a project
- list projects belonging to the authenticated user
- fetch one project owned by the authenticated user
- update a project owned by the authenticated user
- delete a project owned by the authenticated user

### Security And Access Control

- JWT verification is required on project routes
- Users cannot access another user's project
- Users cannot update or delete projects outside their tenant
- Invalid or expired tokens are rejected
- `helmet` is used for basic HTTP hardening

### Validation

The API rejects malformed payloads before writing data:

- `name` must be present and at least 2 characters
- `email` must be valid
- `password` must be at least 8 characters
- `tenantId` is required during registration
- `title` must be between 3 and 120 characters
- `description` must be a string up to 1000 characters
- `status` must be one of `pending`, `active`, `completed`, or `archived`

## Project Structure

```text
src/
  app.js
  server.js
  config/
  controllers/
  middleware/
  routes/
  services/
  utils/
data/
  store.json
```

Role of each layer:

- `routes/`: endpoint definitions
- `controllers/`: request/response handling
- `services/`: business logic
- `middleware/`: auth, validation, async handling, and errors
- `utils/`: shared helpers and the file-backed persistence layer
- `config/`: environment loading

## Requirements

Before running locally, make sure you have:

- Node.js 20+ recommended
- npm
- optionally Docker and Docker Compose if you want the container flow

## How To Run Locally

### 1. Clone The Repository

```bash
git clone https://github.com/dadeteye1/RUDRATEK-BACKEND.git
cd RUDRATEK-BACKEND
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Your Environment File

Copy the example file:

```bash
cp .env.example .env
```

### 4. Configure Environment Variables

Set values in `.env`:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRES_IN=1h
```

Environment variable meaning:

- `PORT`: the port the API listens on locally
- `JWT_SECRET`: required secret used to sign and verify tokens
- `JWT_EXPIRES_IN`: JWT lifetime, for example `1h`

`JWT_SECRET` is mandatory. The app will fail to start if it is missing.

### 5. Start The Server

Production-style run:

```bash
npm start
```

Development watch mode:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

### 6. Verify The Server

Health check:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok"
}
```

## Example Local Usage Flow

### Register A User

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ada Lovelace",
    "email": "ada@example.com",
    "password": "supersecure123",
    "tenantId": "company-alpha"
  }'
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ada@example.com",
    "password": "supersecure123"
  }'
```

Copy the returned token and use it in the next requests.

### Create A Project

```bash
curl -X POST http://localhost:3000/api/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "title": "Launch new dashboard",
    "description": "Coordinate rollout across product and support teams.",
    "status": "active"
  }'
```

### List Your Projects

```bash
curl http://localhost:3000/api/projects \
  -H "Authorization: Bearer <token>"
```

### Update A Project

```bash
curl -X PATCH http://localhost:3000/api/projects/<projectId> \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "status": "completed"
  }'
```

### Delete A Project

```bash
curl -X DELETE http://localhost:3000/api/projects/<projectId> \
  -H "Authorization: Bearer <token>"
```

## API Reference

### Health

- `GET /health`

### Authentication Routes

- `POST /api/auth/register`
- `POST /api/auth/login`

Register request body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "supersecure123",
  "tenantId": "company-alpha"
}
```

Login request body:

```json
{
  "email": "ada@example.com",
  "password": "supersecure123"
}
```

### Project Routes

All project routes require a bearer token:

```http
Authorization: Bearer <jwt>
```

- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`

Project create/update body example:

```json
{
  "title": "Launch new dashboard",
  "description": "Coordinate rollout across product and support teams.",
  "status": "active"
}
```

Allowed project statuses:

- `pending`
- `active`
- `completed`
- `archived`

## Running With Docker

### Build And Run With Docker

```bash
docker build -t backend-ass .
docker run --rm -p 3000:3000 \
  -e JWT_SECRET=replace-with-a-long-random-secret \
  -e JWT_EXPIRES_IN=1h \
  -v "$(pwd)/data:/app/data" \
  backend-ass
```

### Run With Docker Compose

```bash
docker compose up --build
```

Before using Compose outside local testing, update the `JWT_SECRET` value in [docker-compose.yml](/Users/mac2020/Documents/PROJ/BACKEND-ASS/docker-compose.yml).

## Data Storage

The app uses a file-backed store at `data/store.json`.

That means:

- local setup is simple
- no external database is required to run the app
- data persists across runs if the file remains in place

For a real production system, this storage layer should typically be replaced with PostgreSQL, MySQL, or MongoDB.

## Deployment

This project can be deployed as:

- a standard Node web service on Render or Railway
- a containerized service using the included `Dockerfile`

Render settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`

A starter Render blueprint is included in [render.yaml](/Users/mac2020/Documents/PROJ/BACKEND-ASS/render.yaml).

## Helpful Scripts

- `npm start`: start the API
- `npm run dev`: start with Node watch mode
- `npm run check`: syntax check for `src/server.js`

## Notes

- The current implementation is ideal for assignment delivery, demos, and lightweight deployment
- Authentication and project ownership checks were verified locally
- The persistence layer was designed to serialize updates so concurrent writes do not corrupt local state
