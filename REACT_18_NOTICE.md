# Why React 18 Instead of React 19?

## TL;DR

**MSAL (Microsoft Authentication Library) doesn't fully support React 19 yet.**

We're using React 18.3.1 (latest stable) to ensure authentication works perfectly.

## Detailed Explanation

### The Issue with React 19 + MSAL

```
@azure/msal-react@2.1.1 requires React 18.x as a peer dependency
```

While React 19 was released in December 2024, not all libraries have been updated yet. MSAL is one of them.

### What Happens If We Use React 19?

1. **Peer dependency warnings** during installation
2. **Potential runtime errors** in authentication flow
3. **Untested behavior** with MSAL hooks like `useMsal()`, `useIsAuthenticated()`
4. **Risk of breaking changes** in authentication

### Why React 18.3.1 is Still Great

React 18.3.1 is not outdated - it's the **stable LTS version** with:

✅ **Full Next.js 15 support**
✅ **Concurrent rendering**
✅ **Automatic batching**
✅ **Suspense for data fetching**
✅ **Server Components** (via Next.js)
✅ **All modern React features**
✅ **100% MSAL compatibility**
✅ **Stable ecosystem** with all libraries

### Performance & Features

| Feature              | React 18.3.1     | React 19        |
| -------------------- | ---------------- | --------------- |
| Server Components    | ✅ Yes (Next.js) | ✅ Yes          |
| Concurrent Rendering | ✅ Yes           | ✅ Yes          |
| Automatic Batching   | ✅ Yes           | ✅ Yes          |
| Suspense             | ✅ Yes           | ✅ Yes          |
| MSAL Support         | ✅ Full Support  | ⚠️ Not Yet      |
| Next.js 15 Support   | ✅ Full Support  | ✅ Full Support |

### When Will We Upgrade to React 19?

We'll upgrade when:

1. ✅ Microsoft releases MSAL with React 19 support
2. ✅ MSAL is tested and stable with React 19
3. ✅ Other dependencies update their peer dependencies

**Track progress here:**

- [MSAL React GitHub Issues](https://github.com/AzureAD/microsoft-authentication-library-for-js/issues)
- Watch for `@azure/msal-react@3.x.x` or newer versions with React 19 support

## Current Setup

### package.json Dependencies

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@azure/msal-react": "^2.1.1"
  }
}
```

### What Works Perfectly

✅ **Authentication** - Microsoft Entra ID login
✅ **All MSAL hooks** - `useMsal()`, `useIsAuthenticated()`, etc.
✅ **Token management** - Silent token refresh
✅ **Protected routes** - Role-based access
✅ **Next.js 15** - Full App Router support
✅ **Server Components** - Optimal performance
✅ **All UI libraries** - shadcn/ui, Radix UI, etc.

## Migration Path to React 19

When MSAL adds React 19 support, upgrading will be simple:

```bash
# 1. Update React
npm install react@19 react-dom@19

# 2. Update MSAL (when available)
npm install @azure/msal-react@latest

# 3. Update types
npm install -D @types/react@19 @types/react-dom@19

# 4. Test authentication
npm test
```

No code changes should be needed - just dependency updates!

## Verification Commands

### Check Installed Versions

```bash
npm ls react react-dom @azure/msal-react
```

Expected output:

```
straye-relation@1.0.0
├── react@18.3.1
├── react-dom@18.3.1
└── @azure/msal-react@2.1.1
```

### Check for Peer Dependency Issues

```bash
npm ls --depth=0
```

Should show **no warnings** about peer dependencies.

## FAQ

### Q: Is React 18 outdated?

**A:** No! React 18.3.1 is the current LTS (Long Term Support) version. It's actively maintained and used by most production apps.

### Q: Are we missing React 19 features?

**A:** Not really. Most React 19 improvements are internal. The features we need (Server Components, Suspense, etc.) are already in React 18 via Next.js.

### Q: Will Next.js 15 work with React 18?

**A:** Yes! Next.js 15 fully supports both React 18 and React 19. We're using the stable combination.

### Q: Can we use React 19 features?

**A:** We already have them! Next.js provides Server Components, async components, and other modern patterns that work with React 18.

### Q: When will MSAL support React 19?

**A:** Unknown. Typically takes 3-6 months after a major React release. Watch the MSAL GitHub repo for updates.

### Q: Is authentication affected?

**A:** No! MSAL works perfectly with React 18. That's exactly why we're using it.

### Q: Do we lose performance?

**A:** No! React 18 has the same performance benefits. React 19 mainly improves compiler optimizations which Next.js already provides.

## Testing

All tests pass with React 18:

```bash
# Run tests
npm test

# Test authentication specifically
npm test -- useAuth.test.ts
```

## Conclusion

**React 18.3.1 is the right choice** for this project because:

1. ✅ Full MSAL compatibility (authentication works)
2. ✅ Production-ready and stable
3. ✅ All modern React features available
4. ✅ Perfect Next.js 15 support
5. ✅ No missing functionality
6. ✅ Easy upgrade path when ready

**We're not compromising - we're being pragmatic.**

When MSAL supports React 19, we'll upgrade immediately. Until then, React 18.3.1 gives us everything we need with zero authentication issues.

---

**Last Updated:** December 2024
**React Version:** 18.3.1
**MSAL Version:** 2.1.1
**Next.js Version:** 15.1.3
