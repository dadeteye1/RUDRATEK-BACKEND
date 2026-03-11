# RUDRATEK-BACKEND

Secure, modular REST API for a hypothetical multi-tenant project management module. Built with Node.js, Express, JWT authentication, request validation, and strict ownership checks so users can only access their own projects within their tenant.

## Features

- JWT-based authentication with `register` and `login`
- CRUD endpoints for projects
- Multi-tenant aware data model using `tenantId`
- Ownership enforcement: users can only read, update, or delete their own projects
- Input validation for auth and project payloads
- Modular architecture with separated routes, controllers, services, and middleware
- File-backed JSON persistence for local development and quick deployment demos

## Tech Stack

- Node.js
- Express
- JWT (`jsonwebtoken`)
- Password hashing (`bcryptjs`)
- Security headers (`helmet`)

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create your environment file:

```bash
cp .env.example .env
```

3. Set a strong `JWT_SECRET` in `.env`.

4. Start the server:

```bash
npm start
```

The API runs on `http://localhost:3000` by default.

## Run With Docker

Build and run with Docker:

```bash
docker build -t backend-ass .
docker run --rm -p 3000:3000 \
  -e JWT_SECRET=replace-with-a-long-random-secret \
  -e JWT_EXPIRES_IN=1h \
  -v "$(pwd)/data:/app/data" \
  backend-ass
```

Or use Docker Compose:

```bash
docker compose up --build
```

Update `JWT_SECRET` in `docker-compose.yml` before using it outside local testing.

## API Endpoints

### Health

- `GET /health`

### Authentication

- `POST /api/auth/register`
- `POST /api/auth/login`

Register body:

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "supersecure123",
  "tenantId": "company-alpha"
}
```

Login body:

```json
{
  "email": "ada@example.com",
  "password": "supersecure123"
}
```

### Projects

All project endpoints require:

```http
Authorization: Bearer <jwt>
```

- `GET /api/projects`
- `GET /api/projects/:projectId`
- `POST /api/projects`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`

Create/update body example:

```json
{
  "title": "Launch new dashboard",
  "description": "Coordinate rollout across product and support teams.",
  "status": "active"
}
```

Allowed `status` values:

- `pending`
- `active`
- `completed`
- `archived`

## Deployment

This project is suitable for Render or Railway as a simple Node web service.

Typical Render settings:

- Build command: `npm install`
- Start command: `npm start`
- Environment variables: `JWT_SECRET`, `JWT_EXPIRES_IN`, `PORT`

A starter Render blueprint is included in `render.yaml`.

For container-based platforms, the project also includes `Dockerfile` and `docker-compose.yml`.

## GitHub Submission

Suggested commands:

```bash
git init
git add .
git commit -m "Build project management REST API"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

## Notes

- Data is persisted in `data/store.json`. That makes local setup simple, but for production you would typically swap the storage layer for PostgreSQL or MongoDB without changing the route/controller structure.
- A live deployment URL and GitHub repo link were not created from this environment because deployment credentials and remote repository access are not available here.
