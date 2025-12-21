module.exports = {
  "*.{js,jsx,ts,tsx}": [
    "pnpm run lint:staged",
    "prettier --write",
    // Type-check the entire project when TS files change
    () => "pnpm run type-check",
  ],
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
};
