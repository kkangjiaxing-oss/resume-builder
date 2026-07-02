import TemplateRenderer from "@/components/resume/TemplateRenderer";
import type { Resume } from "@/types/resume";
import chromium from "@sparticuz/chromium";
import { existsSync, readFileSync } from "fs";
import path from "path";
import puppeteer, { type Browser } from "puppeteer-core";
import React from "react";
import { renderToReadableStream } from "react-dom/server.edge";

type MaybePromise<T> = T | Promise<T>;

let cachedFontStyles: string | null = null;

export async function launchBrowser(): Promise<Browser> {
  const executablePath = await getExecutablePath();
  const isLocal = Boolean(getLocalExecutablePath() || process.env.PUPPETEER_EXECUTABLE_PATH);
  const localArgs = await Promise.resolve(
    puppeteer.defaultArgs() as unknown as MaybePromise<string[]>,
  );
  const remoteArgs = await Promise.resolve(
    puppeteer.defaultArgs({
      args: chromium.args,
      headless: "shell",
    }) as unknown as MaybePromise<string[]>,
  );
  const browserArgs = isLocal ? localArgs : remoteArgs;

  return puppeteer.launch({
    args: browserArgs,
    defaultViewport: {
      width: 1240,
      height: 1754,
      deviceScaleFactor: 1,
    },
    executablePath,
    headless: isLocal ? true : "shell",
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
    <style>${getPdfFontStyles()}${pdfStyles}</style>
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
    await page.evaluate(() => document.fonts.ready);

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

function getPdfFontStyles() {
  if (cachedFontStyles) {
    return cachedFontStyles;
  }

  const fontsRoot = path.join(process.cwd(), "public", "fonts", "noto-sans-sc");
  const cssPath = path.join(fontsRoot, "pdf.css");
  const css = readFileSync(cssPath, "utf8");

  cachedFontStyles = css.replace(
    /url\(\/fonts\/noto-sans-sc\/files\/([^)]+\.woff)\)/g,
    (_match, fileName: string) => {
      const fontPath = path.join(fontsRoot, "files", fileName);
      const fontBase64 = readFileSync(fontPath).toString("base64");

      return `url(data:font/woff;base64,${fontBase64})`;
    },
  );

  return cachedFontStyles;
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
    font-family: "Noto Sans SC", "Microsoft YaHei", "PingFang SC", "SimSun", Arial, sans-serif;
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

  .modern-template {
    min-height: 0;
    background: #ffffff;
    color: #0f172a;
    padding: 0;
  }

  .modern-shell {
    display: grid;
    grid-template-columns: 32% 68%;
    min-height: 960px;
    background: #ffffff;
  }

  .modern-sidebar {
    position: relative;
    background: #0f2f45;
    color: #ffffff;
    padding: 34px 24px;
  }

  .modern-sidebar-mark {
    width: 38px;
    height: 4px;
    background: #7dd3fc;
    margin-bottom: 26px;
  }

  .modern-kicker {
    color: #bae6fd;
    font-size: 10px;
    letter-spacing: 0;
  }

  .modern-name {
    margin-top: 10px;
    color: #ffffff;
    font-size: 30px;
    line-height: 1.15;
    font-weight: 700;
  }

  .modern-role {
    margin-top: 8px;
    color: #dbeafe;
    font-size: 14px;
    line-height: 1.5;
    font-weight: 600;
  }

  .modern-side-section {
    margin-top: 32px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .modern-side-title {
    color: #bae6fd;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 700;
    padding-bottom: 8px;
    border-bottom: 1px solid rgba(186, 230, 253, 0.35);
  }

  .modern-contact-list,
  .modern-education-list {
    margin-top: 14px;
  }

  .modern-contact-item {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    color: #f8fafc;
    font-size: 11px;
    line-height: 1.6;
  }

  .modern-contact-item + .modern-contact-item {
    margin-top: 8px;
  }

  .modern-contact-icon {
    display: inline-flex;
    width: 18px;
    height: 18px;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: rgba(125, 211, 252, 0.18);
    color: #bae6fd;
    font-size: 10px;
    flex-shrink: 0;
  }

  .modern-skill-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 14px;
  }

  .modern-skill-pill {
    display: inline-flex;
    border: 1px solid rgba(186, 230, 253, 0.4);
    color: #f8fafc;
    padding: 5px 8px;
    border-radius: 999px;
    font-size: 10px;
    line-height: 1.4;
  }

  .modern-side-entry {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .modern-side-entry + .modern-side-entry {
    margin-top: 16px;
  }

  .modern-side-entry h3 {
    color: #ffffff;
    font-size: 12px;
    line-height: 1.45;
    font-weight: 700;
  }

  .modern-side-entry p {
    margin-top: 4px;
    color: #dbeafe;
    font-size: 10px;
    line-height: 1.55;
  }

  .modern-side-entry span {
    display: block;
    margin-top: 4px;
    color: #bae6fd;
    font-size: 10px;
    line-height: 1.5;
  }

  .modern-side-description {
    color: #e0f2fe;
  }

  .modern-main {
    padding: 38px 36px;
  }

  .modern-profile-section {
    display: grid;
    grid-template-columns: 132px minmax(0, 1fr);
    gap: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #dbeafe;
  }

  .modern-section-eyebrow {
    color: #0ea5e9;
    font-size: 10px;
    line-height: 1.4;
    font-weight: 700;
  }

  .modern-section-title {
    margin-top: 6px;
    color: #0f172a;
    font-size: 18px;
    line-height: 1.35;
    font-weight: 700;
  }

  .modern-summary {
    color: #334155;
    font-size: 12px;
    line-height: 1.85;
    white-space: pre-wrap;
  }

  .modern-section {
    margin-top: 28px;
  }

  .modern-section-heading {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 18px;
  }

  .modern-section-heading span {
    width: 20px;
    height: 3px;
    background: #0ea5e9;
  }

  .modern-section-heading h2 {
    color: #0f172a;
    font-size: 16px;
    line-height: 1.4;
    font-weight: 700;
  }

  .modern-timeline {
    border-left: 1px solid #bfdbfe;
    padding-left: 18px;
  }

  .modern-timeline-entry {
    position: relative;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .modern-timeline-entry + .modern-timeline-entry {
    margin-top: 22px;
  }

  .modern-timeline-dot {
    position: absolute;
    left: -23px;
    top: 4px;
    width: 9px;
    height: 9px;
    border-radius: 999px;
    background: #0ea5e9;
    box-shadow: 0 0 0 4px #e0f2fe;
  }

  .modern-entry-header {
    display: flex;
    justify-content: space-between;
    gap: 18px;
  }

  .modern-entry-header h3 {
    color: #0f172a;
    font-size: 14px;
    line-height: 1.45;
    font-weight: 700;
  }

  .modern-entry-header p {
    margin-top: 3px;
    color: #0369a1;
    font-size: 12px;
    line-height: 1.5;
    font-weight: 700;
  }

  .modern-entry-header span {
    flex-shrink: 0;
    color: #64748b;
    font-size: 10px;
    line-height: 1.5;
  }

  .modern-entry-description {
    margin-top: 10px;
    color: #334155;
    font-size: 12px;
    line-height: 1.8;
    white-space: pre-wrap;
  }
`;
