import TemplateRenderer from "@/components/resume/TemplateRenderer";
import type { Resume } from "@/types/resume";
import chromium from "@sparticuz/chromium-min";
import { existsSync } from "fs";
import puppeteer, { type Browser } from "puppeteer-core";
import React from "react";
import { renderToReadableStream } from "react-dom/server.edge";

export async function launchBrowser(): Promise<Browser> {
  const executablePath = await getExecutablePath();

  return puppeteer.launch({
    args: chromium.args,
    defaultViewport: {
      width: 1240,
      height: 1754,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: true,
  });
}

export async function renderResumeHtml(resume: Resume) {
  const resumeStream = await renderToReadableStream(
    React.createElement(TemplateRenderer, {
      title: resume.title,
      templateKey: resume.templateKey,
      content: resume.content,
    }),
  );
  const resumeMarkup = await streamToString(resumeStream);

  return `<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${pdfStyles}</style>
  </head>
  <body>
    <main class="pdf-page">${resumeMarkup}</main>
  </body>
</html>`;
}

export async function generateResumePdf(resume: Resume) {
  const browser = await launchBrowser();

  try {
    const page = await browser.newPage();
    await page.setContent(await renderResumeHtml(resume), {
      waitUntil: "load",
    });

    return await page.pdf({
      format: "A4",
      printBackground: true,
      margin: {
        top: "12mm",
        right: "12mm",
        bottom: "12mm",
        left: "12mm",
      },
    });
  } finally {
    await browser.close();
  }
}

async function getExecutablePath() {
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }

  const localExecutablePath = getLocalExecutablePath();

  if (localExecutablePath) {
    return localExecutablePath;
  }

  return chromium.executablePath();
}

function getLocalExecutablePath() {
  const candidates = [
    "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
    "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium-browser",
    "/usr/bin/chromium",
  ];

  return candidates.find((candidate) => existsSync(candidate));
}

async function streamToString(stream: ReadableStream<Uint8Array>) {
  const response = new Response(stream);

  return response.text();
}

const pdfStyles = `
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    background: #ffffff;
    color: #020617;
    font-family: "Noto Sans CJK SC", "Microsoft YaHei", "PingFang SC", "SimSun", Arial, sans-serif;
  }

  .pdf-page {
    width: 100%;
  }

  .resume-template {
    min-height: 0;
    background: #ffffff;
    color: #020617;
    padding: 0;
  }

  header {
    border-bottom: 1px solid #e2e8f0;
    padding-bottom: 18px;
  }

  section {
    margin-top: 22px;
  }

  h1,
  h2,
  h3,
  p {
    margin: 0;
  }

  h1 {
    margin-top: 8px;
    font-size: 28px;
    line-height: 1.2;
    font-weight: 700;
  }

  h2 {
    font-size: 14px;
    line-height: 1.4;
    font-weight: 700;
  }

  h3 {
    font-size: 15px;
    line-height: 1.5;
    font-weight: 600;
  }

  p {
    font-size: 13px;
    line-height: 1.7;
  }

  .text-xs {
    font-size: 12px;
  }

  .text-sm {
    font-size: 13px;
  }

  .text-base {
    font-size: 15px;
  }

  .text-3xl {
    font-size: 28px;
  }

  .font-medium {
    font-weight: 600;
  }

  .font-semibold {
    font-weight: 700;
  }

  .text-slate-950 {
    color: #020617;
  }

  .text-slate-700 {
    color: #334155;
  }

  .text-slate-600 {
    color: #475569;
  }

  .text-slate-500 {
    color: #64748b;
  }

  .text-blue-700 {
    color: #1d4ed8;
  }

  .border-b {
    border-bottom: 1px solid #e2e8f0;
  }

  .pb-5 {
    padding-bottom: 18px;
  }

  .mt-1 {
    margin-top: 4px;
  }

  .mt-2 {
    margin-top: 8px;
  }

  .mt-3 {
    margin-top: 12px;
  }

  .mt-6 {
    margin-top: 22px;
  }

  .space-y-5 > * + * {
    margin-top: 18px;
  }

  .flex {
    display: flex;
  }

  .items-baseline {
    align-items: baseline;
  }

  .justify-between {
    justify-content: space-between;
  }

  .gap-4 {
    gap: 16px;
  }

  .shrink-0 {
    flex-shrink: 0;
  }

  .whitespace-pre-wrap {
    white-space: pre-wrap;
  }

  .leading-6 {
    line-height: 1.7;
  }

  .resume-entry {
    break-inside: avoid;
    page-break-inside: avoid;
  }
`;
