# Dependency Resolution Fix

## Problems Fixed

### 1. TypeScript ESLint Conflicts
The original package.json had conflicting TypeScript ESLint versions:
- `@typescript-eslint/eslint-plugin@^8.14.0` required `@typescript-eslint/parser@^8.46.4`
- `eslint-config-next@15.1.3` expected `@typescript-eslint/parser@^5.4.2 || ^6.0.0`

### 2. React Version + MSAL Compatibility
- MSAL (`@azure/msal-react@2.1.1`) doesn't fully support React 19 yet
- Using React 18.3.1 (stable LTS) for guaranteed authentication compatibility

## Solution
Removed the separate TypeScript ESLint packages since Next.js 15's `eslint-config-next` includes them internally.

## Changes Made

### 1. Removed Conflicting Packages
**Removed from devDependencies:**
- `@typescript-eslint/eslint-plugin`
- `@typescript-eslint/parser`
- `eslint-plugin-react`
- `eslint-plugin-react-hooks`

These are already included in `eslint-config-next@15.1.3`.

### 2. Simplified ESLint Config
**Updated `.eslintrc.json`:**
```json
{
  "extends": [
    "next/core-web-vitals",  // Includes React & React Hooks rules
    "next/typescript",        // Includes TypeScript ESLint rules
    "prettier"
  ],
  "rules": {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
      "varsIgnorePattern": "^_"
    }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn",
    "no-console": ["warn", { "allow": ["warn", "error"] }]
  }
}
```

### 3. Added .npmrc
Created `.npmrc` for better npm compatibility:
```
legacy-peer-deps=false
strict-peer-dependencies=false
auto-install-peers=true
```

### 4. Pinned Next.js Version
Changed from `^15.1.3` to `15.1.3` (no caret) to ensure consistent installations.

## What's Included in eslint-config-next

`eslint-config-next@15.1.3` includes:
- ✅ `@typescript-eslint/parser`
- ✅ `@typescript-eslint/eslint-plugin`
- ✅ `eslint-plugin-react`
- ✅ `eslint-plugin-react-hooks`
- ✅ `eslint-plugin-jsx-a11y`
- ✅ `@next/eslint-plugin-next`

## Installation Commands

### Clean Install (npm)
```bash
rm -rf node_modules package-lock.json
npm install
```

### Clean Install (pnpm)
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Clean Install (yarn)
```bash
rm -rf node_modules yarn.lock
yarn install
```

## Verification

After installation, verify everything works:

```bash
# Check for peer dependency issues
npm ls

# Run linting
npm run lint

# Run type check
npm run type-check

# Run tests
npm test

# Start dev server
npm run dev
```

## Expected Results

✅ No peer dependency warnings
✅ ESLint works with TypeScript
✅ All React and React Hooks rules active
✅ Compatible with Next.js 15.1.3
✅ Works with npm, pnpm, and yarn

## If You Still Get Errors

### Option 1: Use --legacy-peer-deps (npm)
```bash
npm install --legacy-peer-deps
```

### Option 2: Update npm
```bash
npm install -g npm@latest
```

### Option 3: Clear npm cache
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Option 4: Use pnpm (recommended)
```bash
npm install -g pnpm
pnpm install
```

## Package Versions

### Dependencies
- Next.js: `15.1.3` (pinned)
- React: `^18.3.1` (kept at 18 for MSAL)
- TypeScript: `^5.7.2`
- TanStack Query: `^5.62.7`
- MSAL: `^3.26.1`
- react-day-picker: `8.10.1` (pinned for React 18)

### Dev Dependencies
- ESLint: `^8.57.1`
- eslint-config-next: `15.1.3` (pinned)
- Prettier: `^3.4.2`
- Vitest: `^2.1.8`

## Why This Works

1. **Next.js bundles ESLint plugins**: No need to install separately
2. **Consistent versions**: Next.js ensures compatible plugin versions
3. **Simplified config**: Less configuration, fewer conflicts
4. **Better maintenance**: Updates handled by Next.js team

## Future Updates

When updating Next.js:
```bash
# Update Next.js and ESLint config together
npm install next@latest eslint-config-next@latest

# Or specific version
npm install next@15.1.4 eslint-config-next@15.1.4
```

Always keep `next` and `eslint-config-next` at the same version!

---

**Status: ✅ Fixed**
**Last Updated:** December 2024
**Next.js Version:** 15.1.3
