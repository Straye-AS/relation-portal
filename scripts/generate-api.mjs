#!/usr/bin/env node
/**
 * API Client Generator Script
 *
 * Generates TypeScript types and API client from Swagger/OpenAPI specification.
 * Supports multiple environments: local, staging, prod
 *
 * Usage:
 *   node scripts/generate-api.mjs [environment]
 *   pnpm generate:api           # defaults to local
 *   pnpm generate:api:local     # explicitly local
 *   pnpm generate:api:staging   # staging environment
 *   pnpm generate:api:prod      # production environment
 */

import { generateApi } from "swagger-typescript-api";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment-specific Swagger/OpenAPI URLs
const SWAGGER_URLS = {
  local: "http://localhost:8080/swagger/doc.json",
  staging:
    "https://straye-relation-staging.proudsmoke-10281cc0.norwayeast.azurecontainerapps.io/swagger/doc.json",
  prod: "https://api.straye.no/swagger/doc.json",
};

// Get environment from command line argument, default to 'local'
const environment = process.argv[2] || "local";

if (!SWAGGER_URLS[environment]) {
  console.error(`❌ Unknown environment: "${environment}"`);
  console.error(
    `   Available environments: ${Object.keys(SWAGGER_URLS).join(", ")}`
  );
  process.exit(1);
}

const swaggerUrl = SWAGGER_URLS[environment];
const outputDir = path.resolve(__dirname, "../lib/.generated");

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log(`🚀 Generating API client from ${environment} environment...`);
console.log(`   URL: ${swaggerUrl}`);
console.log(`   Output: ${outputDir}`);
console.log("");

try {
  const { files } = await generateApi({
    url: swaggerUrl,
    output: outputDir,
    name: "Api.ts",
    httpClientType: "fetch",
    generateClient: true,
    generateRouteTypes: true,
    generateResponses: true,
    extractRequestParams: true,
    extractRequestBody: true,
    extractEnums: true,
    unwrapResponseData: false,
    singleHttpClient: true,
    cleanOutput: true,
    moduleNameFirstTag: true,
    modular: true,
    prettier: {
      semi: true,
      singleQuote: true,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 100,
    },
  });

  console.log("✅ API client generated successfully!");
  console.log("");
  console.log("Generated files:");
  files.forEach((file) => {
    console.log(`   - ${file.fileName}`);
  });
  console.log("");
  console.log(`📁 Output directory: lib/.generated/`);
} catch (error) {
  console.error("❌ Failed to generate API client:");
  console.error(`   ${error.message}`);

  if (environment === "local") {
    console.error("");
    console.error("💡 Make sure your local API server is running at:");
    console.error(`   ${swaggerUrl}`);
  }

  process.exit(1);
}
