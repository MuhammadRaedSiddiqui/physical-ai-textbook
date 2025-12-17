# Better Auth Server

This is the authentication server for the Physical AI Textbook, using Better Auth and Hono.

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Set up environment variables in `.env` (already created).

3.  Run database migrations (Better Auth handles this automatically on start or via CLI):
    ```bash
    npx better-auth migrate
    ```

## Running the Server

Start the development server:

```bash
npm run dev
```

The server runs on `http://localhost:4000`.

## API Endpoints

Better Auth exposes endpoints at `/api/auth/*`.
