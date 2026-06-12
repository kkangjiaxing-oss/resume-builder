import { buildPolishResumeTextPrompt } from "@/lib/aiPrompts";
import { createOpenAIClient, defaultOpenAIModel } from "@/lib/openai";
import type { AiPolishFieldType } from "@/types/ai";

type PolishResumeTextOptions = {
  signal?: AbortSignal;
};

export async function polishResumeText(fieldType: AiPolishFieldType, text: string, options: PolishResumeTextOptions = {}) {
  const client = createOpenAIClient();

  const response = await client.chat.completions.create({
    model: defaultOpenAIModel,
    messages: buildPolishResumeTextPrompt({
      fieldType,
      text,
    }),
    max_tokens: 800,
  }, {
    signal: options.signal,
  });

  return response.choices[0]?.message?.content?.trim() ?? "";
}
