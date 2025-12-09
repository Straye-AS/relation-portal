# Straye Relation

Intern CRM og tilbudshåndtering for Straye Group.

## 🚀 Teknologier

- **Framework:** Next.js 15.1.3 (App Router) - Latest stable version
- **React:** React 18.3.1 - Stable LTS (for MSAL compatibility)
- **Language:** TypeScript 5.7.2 (strict mode)
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** Zustand + TanStack Query (React Query)
- **Authentication:** Microsoft Entra ID (MSAL)
- **Charts:** Recharts
- **Validation:** Zod
- **Animations:** Framer Motion
- **Testing:** Vitest
- **Package Manager:** pnpm

## 📋 Forutsetninger

- Node.js 20.18.0+ (LTS)
- npm 10+ (eller pnpm 8+ / yarn 4+)
- Microsoft Entra ID (Azure AD) app registrering

> **Note:** All dependencies updated to latest stable versions (December 2024)
> Works with npm, pnpm, or yarn

## 🛠️ Installasjon

1. Klon repository:

```bash
git clone <repository-url>
cd straye-relation
```

2. Installer avhengigheter:

```bash
# Using npm (recommended)
npm install

# Or using pnpm
pnpm install

# Or using yarn
yarn install
```

3. Kopier `.env.local.example` til `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Konfigurer miljøvariabler i `.env.local`:

**For lokal utvikling (anbefalt for å komme raskt i gang):**

```env
# Bruk lokal test-bruker (ingen Microsoft-konto nødvendig)
NEXT_PUBLIC_USE_LOCAL_AUTH=true
```

**For produksjonslignende testing med Microsoft:**

```env
NEXT_PUBLIC_USE_LOCAL_AUTH=false
NEXT_PUBLIC_AZURE_CLIENT_ID=your-client-id
NEXT_PUBLIC_AZURE_TENANT_ID=your-tenant-id
NEXT_PUBLIC_AZURE_REDIRECT_URI=http://localhost:3000
```

## 🏃 Kjøre lokalt

```bash
npm run dev
# Or: pnpm dev / yarn dev
```

Applikasjonen vil være tilgjengelig på http://localhost:3000

## 🧪 Testing

```bash
# Kjør tester
npm test

# Kjør tester med UI
npm run test:ui

# Kjør tester med dekning
npm run test:coverage
```

## 🔍 Linting og Formattering

```bash
# Kjør ESLint
npm run lint

# Fiks ESLint-feil automatisk
npm run lint:fix

# Kjør Prettier
npm run format

# Sjekk formattering
npm run format:check

# Type-sjekk
npm run type-check
```

## 🏗️ Bygg for produksjon

```bash
npm run build
npm start
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

### Lokal utvikling uten Microsoft-konto

For lokal utvikling kan du bruke lokal autentisering uten å trenge en Microsoft-konto:

```bash
# I .env.local
NEXT_PUBLIC_USE_LOCAL_AUTH=true
```

Dette gir deg tilgang til en testutvikler uten innlogging via Microsoft. Se [LOCAL_AUTH.md](./LOCAL_AUTH.md) for fullstendig dokumentasjon.

**Quick start:**

1. Sett `NEXT_PUBLIC_USE_LOCAL_AUTH=true` i `.env.local`
2. Start dev-serveren
3. Klikk "Logg inn som testutvikler" på login-siden
4. Bruk auth-toggle-knappen for å bytte mellom lokal og Microsoft-autentisering

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
