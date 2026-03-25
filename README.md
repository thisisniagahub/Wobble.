# Wobble Landing Page

Single-page Next.js landing page for Wobble panna cotta flavours, gifting, and WhatsApp ordering.

## Run Locally

Prerequisite: Node.js 20+

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Open `http://localhost:3000`

## Available Scripts

- `npm run dev` starts the development server
- `npm run build` creates the production build
- `npm run start` serves the production build
- `npm run lint` runs ESLint
- `npm run clean` removes the local `.next` build output

## Environment Variables

Set these before deploying if you want direct WhatsApp routing and Telegram login:

- `NEXT_PUBLIC_WOBBLE_SITE_URL`
- `NEXT_PUBLIC_WOBBLE_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_WOBBLE_TELEGRAM_BOT_USERNAME`
- `WOBBLE_TELEGRAM_BOT_TOKEN`
- `WOBBLE_TELEGRAM_SESSION_SECRET`
