import { gateway } from "ai";

const MODEL_ID = "openai/gpt-5-nano";

export const aiModel = gateway(MODEL_ID);
