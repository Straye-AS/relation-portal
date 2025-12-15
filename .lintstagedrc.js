module.exports = {
  "*.{js,jsx,ts,tsx}": ["pnpm run lint:staged", "prettier --write"],
  "*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
};
