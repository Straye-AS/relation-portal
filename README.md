# Straye Relation

Intern CRM og tilbudshåndtering for Straye Group.

## 🚀 Teknologier

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict mode)
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** Zustand + TanStack Query (React Query)
- **Authentication:** Microsoft Entra ID (MSAL)
- **Charts:** Recharts
- **Validation:** Zod
- **Animations:** Framer Motion
- **Testing:** Vitest
- **Package Manager:** pnpm

## 📋 Forutsetninger

- Node.js 20+
- pnpm 8+
- Microsoft Entra ID (Azure AD) app registrering

## 🛠️ Installasjon

1. Klon repository:
```bash
git clone <repository-url>
cd straye-relation
```

2. Installer avhengigheter:
```bash
pnpm install
```

3. Kopier `.env.example` til `.env.local` og fyll inn verdier:
```bash
cp .env.example .env.local
```

4. Konfigurer miljøvariabler i `.env.local`:
```
NEXT_PUBLIC_API_URL=https://api.straye-relation.dev
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

## 🏃 Kjøre lokalt

```bash
pnpm dev
```

Applikasjonen vil være tilgjengelig på http://localhost:3000

## 🧪 Testing

```bash
# Kjør tester
pnpm test

# Kjør tester med UI
pnpm test:ui

# Kjør tester med dekning
pnpm test:coverage
```

## 🔍 Linting og Formattering

```bash
# Kjør ESLint
pnpm lint

# Fiks ESLint-feil automatisk
pnpm lint:fix

# Kjør Prettier
pnpm format

# Sjekk formattering
pnpm format:check

# Type-sjekk
pnpm type-check
```

## 🏗️ Bygg for produksjon

```bash
pnpm build
pnpm start
```

## 🐳 Docker

### Bygg Docker-image

```bash
docker build -t straye-relation .
```

### Kjør med Docker Compose

```bash
docker-compose up -d
```

## 📁 Mappestruktur

```
/app/                      → Next.js App Router pages + layouts
/components/
  /ui/                     → Shared UI primitives (Button, Card, etc.)
  /layout/                 → Layout components (Header, Sidebar)
/features/                 → Feature modules (offers, customers, projects)
/hooks/                    → Reusable React hooks
/store/                    → Zustand stores
/lib/
  /api/                    → API client
  /auth/                   → MSAL authentication
  /mocks/                  → Mock data for development
/types/                    → TypeScript type definitions
/locales/                  → Translation files
/tests/                    → Unit tests
/.github/workflows/        → CI/CD configuration
```

## 🔐 Autentisering

Applikasjonen bruker Microsoft Entra ID (Azure AD) for autentisering via MSAL. Bare autoriserte brukere i Straye Group kan logge inn.

## 🎨 Temaer

Applikasjonen støtter lys, mørk og system-tema. Brukere kan endre tema i innstillingene.

## 🌐 Språk

Støtte for norsk (standard) og engelsk. Språkinnstillinger kan endres i innstillingene.

## 🚢 Deployment

### Azure Container Apps

Applikasjonen er konfigurert for deployment til Azure Container Apps via GitHub Actions.

**GitHub Secrets som må konfigureres:**
- `ACR_REGISTRY`: Azure Container Registry URL
- `ACR_USERNAME`: ACR brukernavn
- `ACR_PASSWORD`: ACR passord
- `AZURE_CREDENTIALS`: Azure service principal credentials
- `AZURE_RESOURCE_GROUP`: Azure resource group navn
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXT_PUBLIC_AZURE_CLIENT_ID`: Azure AD Client ID
- `NEXT_PUBLIC_AZURE_TENANT_ID`: Azure AD Tenant ID

### CI/CD Pipeline

GitHub Actions workflow kjører automatisk ved push til `main` eller `develop`:
1. Lint og test
2. Build
3. Bygg og push Docker image
4. Deploy til Azure Container Apps (kun main branch)

## 📄 Lisens

Proprietary - Straye Group

## 🤝 Bidrag

Kun for interne utviklere i Straye Group.

## 📞 Kontakt

For support eller spørsmål, kontakt IT-teamet i Straye Group.
