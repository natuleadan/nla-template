import { gateway } from "ai";

const MODEL_ID = "openai/gpt-4o-mini";

export const aiModel = gateway(MODEL_ID);
