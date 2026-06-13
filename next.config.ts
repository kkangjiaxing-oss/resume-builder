import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/resumes/[id]/pdf": ["./node_modules/@sparticuz/chromium/bin/**/*"],
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
