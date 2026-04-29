export interface CoreMessage {
  role: "user" | "assistant" | "system";
  content: string | Array<{ type: string; text?: string; image?: string }>;
}

export interface ToolContext {
  phone: string;
  customerName?: string;
  isAdmin: boolean;
}

export interface SessionState {
  phone: string;
  name?: string;
  history: CoreMessage[];
  createdAt: number;
  lastActivity: number;
}
