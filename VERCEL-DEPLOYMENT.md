# Vercel Deployment Guide for so1-console

## Quick Start

### 1. Connect Repository to Vercel

1. Go to [Vercel Dashboard](https://vercel.com)
2. Click "Add New..." → "Project"
3. Import the `so1-io/so1-console` repository
4. Click "Import"

### 2. Configure Environment Variables

In the Vercel project dashboard, go to **Settings → Environment Variables** and add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY = sk_test_xxxxxxxxxxxx
NEXT_PUBLIC_BFF_URL = https://your-bff-domain.com
```

**Note**: `NEXT_PUBLIC_BFF_URL` should point to where `so1-control-plane-api` is hosted.

### 3. Deploy

Vercel will automatically deploy on push to `main` branch.

## Environment Variables Explained

### Required for Production

- **NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY**: Public key from Clerk dashboard (exposed to browser)
- **CLERK_SECRET_KEY**: Secret key from Clerk dashboard (server-only)
- **NEXT_PUBLIC_BFF_URL**: Full URL of your backend service (e.g., `https://api.mycompany.com`)

### Development (.env.local)

For local development, create a `.env.local` file:

```bash
cp .env.example .env.local
# Edit .env.local with your local values
npm run dev
```

## Clerk Setup (First Time)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application
3. Copy the **Publishable Key** and **Secret Key**
4. Configure OAuth (GitHub, Google, etc.) if needed
5. Add redirect URIs:
   - Development: `http://localhost:3000`
   - Production: `https://your-vercel-app.vercel.app`

## Troubleshooting

### "Clerk is not initialized"
- Ensure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in Vercel Environment Variables
- Redeploy after adding environment variables

### "Failed to fetch from BFF"
- Verify `NEXT_PUBLIC_BFF_URL` is correct and accessible
- Check that `so1-control-plane-api` is running and has CORS enabled
- Use browser DevTools Console to see network errors

### Build Fails with Missing Dependencies
- Run `npm install` locally to ensure `package-lock.json` is up to date
- Commit `package-lock.json` to git
- Vercel will use it for reproducible builds

## Architecture

```
┌─────────────────────────────────────────┐
│         Vercel (Frontend)               │
│  https://console.vercel.app             │
│  ├─ Next.js 16 App Router               │
│  ├─ React 19 Components                 │
│  └─ Clerk Authentication                │
└──────────────┬──────────────────────────┘
               │ HTTPS
               ▼
┌─────────────────────────────────────────┐
│     Your Backend (so1-control-plane-api)│
│   https://api.your-domain.com           │
│  ├─ Hono Server (Node.js)               │
│  ├─ GitHub/n8n Integration              │
│  └─ Secret Management                   │
└─────────────────────────────────────────┘
```

## Next Steps

1. **Backend Deployment**: Deploy `so1-control-plane-api` to Railway, Heroku, or self-hosted
2. **Clerk Configuration**: Set up authentication providers
3. **Custom Domain**: Update Vercel project settings with your custom domain
4. **Monitoring**: Configure Vercel Analytics and Error Tracking
5. **Preview Deployments**: Enable GitHub integration for preview URLs on PRs

## CI/CD Pipeline

Vercel automatically:
- Deploys on every push to `main` (production)
- Creates preview deployments for pull requests
- Runs zero-downtime deployments

No additional GitHub Actions needed for frontend deployment.
