# Honey-an Backoffice

## Local development

```bash
yarn install --frozen-lockfile
yarn dev
```

Copy `.env.example` to `.env` and set `GEMINI_API_KEY` to enable Gemini-generated marketing content. Without the key, the API uses its built-in fallback response.

## Deploy to Vercel

1. Import the Git repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Keep the detected framework as **Vite**. Build and install commands are defined in `vercel.json`.
4. Add `GEMINI_API_KEY` in **Project Settings > Environment Variables** for Production, Preview, and Development as needed.
5. Deploy.

The frontend is built to `dist`, SPA routes fall back to `index.html`, and `/api/*` requests are handled by the Express Vercel Function in `api/index.ts`.
