import OpenAI from "openai";

export const defaultOpenAIModel = process.env.OPENAI_MODEL ?? "deepseek-v4-flash";

export function createOpenAIClient() {
  const apiKey = process.env.OPENAI_API_KEY ?? process.env.DEEPSEEK_API_KEY ?? process.env.deepseek_API_KEY;
  const baseURL = process.env.OPENAI_BASE_URL ?? process.env.DEEPSEEK_BASE_URL ?? "https://api.deepseek.com";

  if (!apiKey) {
    throw new Error("Missing AI API key environment variable.");
  }

  return new OpenAI({
    apiKey,
    baseURL,
  });
}
