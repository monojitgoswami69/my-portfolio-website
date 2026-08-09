import "server-only";

import { GoogleGenAI } from "@google/genai";
import type { ChatHistoryMessage } from "./server";

export interface GeminiGenerationConfig {
  temperature: number;
  topP: number;
  topK?: number;
  maxOutputTokens: number;
  systemInstruction: string;
}

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

function getGeminiClient() {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey: GEMINI_API_KEY });
}

type GeminiContent = {
  role: "user" | "model";
  parts: Array<{ text: string }>;
};

function formatHistoryForGemini(
  history: ChatHistoryMessage[],
  message: string
): GeminiContent[] {
  const contents: GeminiContent[] = history.map((item) => ({
    role: item.role === "model" ? "model" : "user",
    parts: item.parts.map((text) => ({ text })),
  }));
  contents.push({ role: "user", parts: [{ text: message }] });
  return contents;
}

export async function geminiGenerateResponseText(
  message: string,
  history: ChatHistoryMessage[],
  config: GeminiGenerationConfig
): Promise<string> {
  const ai = getGeminiClient();
  const contents = formatHistoryForGemini(history, message);
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: config.systemInstruction,
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
      maxOutputTokens: config.maxOutputTokens,
    },
  });

  const text = response.text?.trim();
  if (!text) {
    throw new Error("No response text received from Gemini API");
  }

  return text;
}

export async function* geminiStreamChatResponse(
  message: string,
  history: ChatHistoryMessage[],
  config: GeminiGenerationConfig
): AsyncGenerator<string> {
  const ai = getGeminiClient();
  const contents = formatHistoryForGemini(history, message);
  const stream = await ai.models.generateContentStream({
    model: GEMINI_MODEL,
    contents,
    config: {
      systemInstruction: config.systemInstruction,
      temperature: config.temperature,
      topP: config.topP,
      topK: config.topK,
      maxOutputTokens: config.maxOutputTokens,
    },
  });

  let chunkCount = 0;

  for await (const chunk of stream) {
    const text = chunk.text;
    if (text) {
      chunkCount += 1;
      yield text;
    }
  }

  if (chunkCount === 0) {
    throw new Error("No response chunks received from Gemini API");
  }
}
