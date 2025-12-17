# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Straye Relation is an internal CRM and offer management system for Straye Group. It's a Next.js 16 application with TypeScript, using Microsoft Entra ID (Azure AD) for authentication.

## Common Commands

```bash
# Development
pnpm dev                    # Start dev server on http://localhost:3000

# Testing
pnpm test                   # Run tests with vitest
pnpm test:ui                # Run tests with visual UI
pnpm test:coverage          # Run tests with coverage report

# Linting & Formatting
pnpm lint                   # Run ESLint
pnpm lint:fix               # Fix ESLint errors
pnpm type-check             # TypeScript type checking
pnpm format                 # Format with Prettier

# API Type Generation
pnpm generate:api           # Generate types from local backend (localhost:8080)
pnpm generate:api:staging   # Generate types from staging backend
pnpm generate:api:prod      # Generate types from production backend

# Build
pnpm build                  # Production build
```

## Architecture

### Authentication Dual-Mode System

The app supports two authentication modes controlled by `NEXT_PUBLIC_USE_LOCAL_AUTH`:

- **MSAL mode**: Production authentication via Microsoft Entra ID (`lib/auth/msalConfig.ts`)
- **Local mode**: Development authentication for testing without Microsoft account (`lib/auth/LocalAuthContext.tsx`)

The `useAuth()` hook (`hooks/useAuth.ts`) automatically switches between modes based on configuration and provides a unified interface.

### API Client Architecture

The API layer has two implementations:

1. **Mock Client** (`lib/api/client.ts`): Used for offline development with simulated data from `lib/mocks/`

2. **Generated API Client** (`lib/.generated/`): Auto-generated from OpenAPI/Swagger spec using `swagger-typescript-api`. The `ApiProvider` (`lib/api/api-provider.tsx`) creates authenticated instances of all API modules and injects the access token and company ID header.

To use the real API, ensure the backend is running and regenerate types with `pnpm generate:api`.

### Provider Hierarchy

The app wraps everything in providers defined in `lib/providers.tsx`:

```
AuthProvider → ApiProvider → QueryClientProvider → TooltipProvider → ThemeProvider
```

### State Management

- **TanStack Query**: Server state (API data) - hooks in `hooks/use*.ts`
- **Zustand stores** (`store/`):
  - `company-store.ts`: Selected company context with localStorage persistence
  - `useUIStore.ts`: UI state (sidebar, modals)
  - `useNotificationStore.ts`: Notification state

### Multi-Company Support

The `useCompanyStore` manages company context. The selected company ID is passed to the API via `X-Company-ID` header. Super admins can view all companies; regular users are restricted to their assigned company.

### Path Aliases

Use `@/` for imports (maps to project root via `tsconfig.json`).

## Key Directories

- `app/` - Next.js App Router pages
- `components/ui/` - shadcn/ui primitives
- `components/` - Feature-specific components
- `hooks/` - Custom React hooks (most use TanStack Query)
- `lib/.generated/` - Auto-generated API client (do not edit manually)
- `lib/api/` - API client configuration
- `lib/auth/` - Authentication configuration
- `lib/mocks/` - Mock data for development
- `store/` - Zustand stores
- `types/` - TypeScript type definitions

## Testing

Tests use Vitest with jsdom environment. Setup file is `tests/setup.ts`. Tests are located in `tests/` mirroring the source structure.

Run a single test file:

```bash
pnpm test tests/hooks/useOffers.test.tsx
```

## Environment Variables

Key variables for local development:

- `NEXT_PUBLIC_USE_LOCAL_AUTH=true` - Enable local auth mode
- `NEXT_PUBLIC_API_URL` - Backend API URL (defaults to localhost:8080)
- `NEXT_PUBLIC_AZURE_CLIENT_ID` - Azure AD client ID (for MSAL mode)
- `NEXT_PUBLIC_AZURE_TENANT_ID` - Azure AD tenant ID (for MSAL mode)
