<<<<<<< HEAD
<<<<<<< HEAD
# Eventify

Eventify is a React + Vite frontend with a Node.js + Express backend for browsing events and handling basic user authentication.

## Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Auth: JWT, bcryptjs
- Validation: Zod
- Deployment: Render

## Project Structure

```text
app/
├─ src/                  Frontend source
├─ server/               Backend source
├─ render.yaml           Render blueprint
├─ package.json          Frontend package manifest
└─ README.md
```

## Local Setup

### Frontend

```powershell
cd C:\Users\adi\Documents\figma\app
npm install
npm run dev
```

### Backend

```powershell
cd C:\Users\adi\Documents\figma\app\server
Copy-Item .env.example .env
npm install
npm start
```

### Local URLs

- Frontend: `http://127.0.0.1:5173`
- Backend: `http://127.0.0.1:5000`
- Health check: `http://127.0.0.1:5000/api/health`

## Default Admin Login

- Email: `admin@eventify.local`
- Password: `Admin@12345`

## Deploy To Render

This repo already includes [render.yaml](./render.yaml).

### Steps

1. Push this project to GitHub.
2. In Render, choose `New +` -> `Blueprint`.
3. Connect the GitHub repo.
4. Render will create:
   - `eventify-api` as the backend service
   - `eventify-web` as the static frontend
5. Deploy.

## Environment

Use [server/.env.example](./server/.env.example) as the backend template.

Frontend production API calls use `VITE_API_URL`.
=======
=======
>>>>>>> e91372e (initial commit)

  # Untitled

  This is a code bundle for Untitled. The original project is available at https://www.figma.com/design/2CcIL8wS6de4WZx9fln0R5/Untitled.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development server.
<<<<<<< HEAD
  
>>>>>>> e91372e (initial commit)
=======
  
>>>>>>> e91372e (initial commit)
