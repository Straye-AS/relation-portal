# 🚀 Quick Start Guide - Straye Relation

## Latest Version Info
- **Next.js:** 15.1.3 (latest stable)
- **React:** 19.0.0 (latest stable)
- **TypeScript:** 5.7.2
- **All dependencies:** Updated December 2024

> **Note:** Next.js 16 doesn't exist yet. Version 15.1.3 is the latest stable release.

## Prerequisites
- Node.js 20.18.0 (LTS) - Use `nvm use` if you have .nvmrc
- pnpm 8 or later
- Azure AD app registration (for authentication)

## Installation

### 1. Install Dependencies
```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### 2. Configure Environment
```bash
# Copy example environment file
cp .env.example .env.local

# Edit .env.local and add your Azure AD credentials
```

Required variables in `.env.local`:
```bash
NEXT_PUBLIC_API_URL=https://api.straye-relation.dev
NEXT_PUBLIC_AZURE_CLIENT_ID=your-azure-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-azure-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
NEXT_PUBLIC_DEFAULT_LANGUAGE=no
```

### 3. Run Development Server
```bash
pnpm dev
```

Open http://localhost:3000 in your browser.

## Development Commands

```bash
# Development
pnpm dev              # Start dev server (with Turbopack)

# Building
pnpm build            # Build for production
pnpm start            # Start production server

# Code Quality
pnpm lint             # Run ESLint
pnpm lint:fix         # Fix ESLint issues
pnpm format           # Format code with Prettier
pnpm format:check     # Check formatting
pnpm type-check       # TypeScript type checking

# Testing
pnpm test             # Run tests
pnpm test:ui          # Run tests with UI
pnpm test:coverage    # Run tests with coverage
```

## Docker (Production)

```bash
# Build image
docker build -t straye-relation .

# Run with docker-compose
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## Azure AD Setup

### Quick Setup
1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to: Azure Active Directory → App registrations
3. Click "New registration"
4. Configure:
   - Name: **Straye Relation**
   - Supported accounts: **Single tenant**
   - Redirect URI: **Single-page application (SPA)** → `http://localhost:3000`
5. Copy **Application (client) ID** → `NEXT_PUBLIC_AZURE_CLIENT_ID`
6. Copy **Directory (tenant) ID** → `NEXT_PUBLIC_AZURE_TENANT_ID`
7. Add API permissions:
   - Microsoft Graph → Delegated → `User.Read`, `openid`, `profile`, `email`
8. Grant admin consent

## Project Structure

```
/app/                    → Pages (App Router)
  ├── page.tsx          → Dashboard
  ├── offers/           → Offers module
  ├── customers/        → Customers module
  ├── projects/         → Projects module
  ├── notifications/    → Notifications
  └── settings/         → Settings

/components/
  ├── ui/               → shadcn/ui components
  └── layout/           → Header, Sidebar, Layout

/hooks/                 → React Query hooks
/store/                 → Zustand stores
/lib/
  ├── api/              → API client (mock)
  ├── auth/             → MSAL auth
  └── mocks/            → Mock data

/types/                 → TypeScript types
/locales/               → Translations (NO, EN)
/tests/                 → Vitest tests
```

## Features

✅ **Authentication** - Microsoft Entra ID (MSAL)
✅ **Dashboard** - Metrics, charts, recent items
✅ **Offers** - List, details, disciplines, margins
✅ **Customers** - List, details, relationships
✅ **Projects** - List, details, budget tracking
✅ **Notifications** - Activity feed
✅ **Settings** - Theme, language, preferences
✅ **Mock Data** - Ready for development
✅ **Type-safe** - Full TypeScript coverage
✅ **Tested** - Vitest + Testing Library
✅ **Responsive** - Mobile & desktop
✅ **Themes** - Light/dark/system
✅ **Norwegian** - Default language

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
PORT=3001 pnpm dev
```

### Authentication Not Working
1. Check Azure AD redirect URI matches exactly
2. Verify Client ID and Tenant ID in `.env.local`
3. Clear browser cache and cookies
4. Check browser console for MSAL errors

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
pnpm install
pnpm build
```

### Types Not Found
```bash
# Reinstall types
pnpm add -D @types/react@latest @types/react-dom@latest @types/node@latest
```

## What's Next?

### Immediate Tasks
1. ✅ Set up Azure AD
2. ✅ Test authentication
3. ✅ Review mock data
4. 📝 Customize UI/branding
5. 📝 Add more mock data if needed

### Backend Integration
When .NET 8 backend is ready:
1. Update `NEXT_PUBLIC_API_URL`
2. Replace functions in `lib/api/client.ts`
3. Use OpenAPI-generated client
4. Test end-to-end

### Future Features
- Create/edit forms
- File uploads
- Advanced filtering
- Export to Excel/PDF
- Role-based access
- Audit logging
- Teams Graph API integration
- Email notifications

## Support

📚 **Documentation:**
- README.md - Full documentation
- SETUP.md - Detailed setup guide
- UPGRADE_NOTES.md - Latest upgrade info
- MIGRATION_SUMMARY.md - Migration details

🐛 **Issues:**
- Check browser console
- Check terminal output
- Review `.env.local` configuration
- Verify Node.js version (20.18.0+)

## Performance Tips

```bash
# Use Turbopack (faster dev server)
pnpm dev --turbo

# Analyze bundle size
pnpm build
# Check .next/build-manifest.json

# Clear all caches
rm -rf .next node_modules/.cache
```

## Deployment

### Azure Container Apps
1. Configure GitHub secrets
2. Push to main branch
3. GitHub Actions automatically deploys

### Manual Deployment
```bash
pnpm build
docker build -t straye-relation .
docker push <your-registry>/straye-relation:latest
```

---

**Happy coding! 🎉**

For detailed information, see `README.md` and `SETUP.md`.
