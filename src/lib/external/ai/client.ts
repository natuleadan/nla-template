import { gateway } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import {
  getAiProvider,
  getOpenaiApiKey,
  isDev,
} from "@/lib/env";

const GW_MODEL_ID = "openai/gpt-5-nano";
const OA_MODEL_ID = "gpt-5-nano";

function createAiModel() {
  const provider = getAiProvider();

  if (provider === "openai") {
    const key = getOpenaiApiKey();
    if (!key) {
      if (isDev)
        console.warn("[AI] OPENAI_API_KEY not set, falling back to AI Gateway");
    } else {
      const openai = createOpenAI({ apiKey: key });
      return openai(OA_MODEL_ID);
    }
  }

  return gateway(GW_MODEL_ID);
}

export const aiModel = createAiModel();
