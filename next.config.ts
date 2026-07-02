import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/api/resumes/[id]/pdf": [
      "./node_modules/@sparticuz/chromium/bin/**/*",
      "./public/fonts/noto-sans-sc/**/*",
    ],
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
};

export default nextConfig;
