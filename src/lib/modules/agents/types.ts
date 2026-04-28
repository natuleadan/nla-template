import type { CoreMessage } from "@/lib/external/ai/stream.service";

export interface ToolContext {
  phone: string;
  customerName?: string;
}

export interface SessionState {
  phone: string;
  name?: string;
  history: CoreMessage[];
  createdAt: number;
  lastActivity: number;
}
