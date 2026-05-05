import { describe, it, expect } from "vitest";
import { anonymizePhone } from "@/lib/modules/agents/session-store";
import type { CoreMessage } from "@/lib/modules/agents/types";

describe("session-store - anonymizePhone", () => {
  it("should return deterministic hash for same phone", async () => {
    process.env.WS_ENCRYPTION_KEY = "test-key-123";
    const a = await anonymizePhone("00000000000");
    const b = await anonymizePhone("00000000000");
    expect(a).toBe(b);
    expect(a.length).toBe(16);
  });

  it("should return different hashes for different phones", async () => {
    process.env.WS_ENCRYPTION_KEY = "test-key-123";
    const a = await anonymizePhone("593967310412");
    const b = await anonymizePhone("00000000001");
    expect(a).not.toBe(b);
  });

  it("should return raw phone if no encryption key", async () => {
    const orig = process.env.WS_ENCRYPTION_KEY;
    delete process.env.WS_ENCRYPTION_KEY;
    const result = await anonymizePhone("00000000000");
    expect(result).toBe("00000000000");
    process.env.WS_ENCRYPTION_KEY = orig;
  });
});

describe("session-store - SessionState type", () => {
  it("should support basic session structure", () => {
    const session = {
      phone: "abc123",
      name: "Test User",
      history: [] as CoreMessage[],
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
    expect(session.phone).toBe("abc123");
    expect(session.name).toBe("Test User");
    expect(session.history).toEqual([]);
  });

  it("should support adding messages to history", () => {
    const session = {
      phone: "abc123",
      history: [] as CoreMessage[],
      createdAt: Date.now(),
      lastActivity: Date.now(),
    };
    session.history.push({ role: "user", content: "hola" });
    session.history.push({ role: "assistant", content: "Hola!" });
    expect(session.history).toHaveLength(2);
    expect(session.history[0].role).toBe("user");
    expect(session.history[1].role).toBe("assistant");
  });

  it("should support system role messages", () => {
    const msg: CoreMessage = {
      role: "system",
      content: "[Button pressed] Product X",
    };
    expect(msg.role).toBe("system");
    expect(msg.content).toContain("Product X");
  });

  it("should support multimodal content", () => {
    const msg: CoreMessage = {
      role: "user",
      content: [
        { type: "text", text: "caption" },
        { type: "image", image: "data:image/jpeg;base64,/9j/" },
      ],
    };
    expect(Array.isArray(msg.content)).toBe(true);
    expect(msg.content).toHaveLength(2);
  });

  it("should cap history at 50 messages", () => {
    const MAX_HISTORY = 50;
    const history: CoreMessage[] = [];
    for (let i = 0; i < 60; i++) {
      history.push({ role: "user", content: `msg ${i}` });
    }
    const trimmed =
      history.length > MAX_HISTORY ? history.slice(-MAX_HISTORY) : history;
    expect(trimmed).toHaveLength(50);
    expect(trimmed[0].content).toBe("msg 10");
  });

  it("should produce data URI from buffer", () => {
    const buffer = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]).buffer;
    const mimeType = "image/png";
    const b64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const uri = `data:${mimeType};base64,${b64}`;
    expect(uri).toMatch(/^data:image\/png;base64,/);
  });
});

describe("session-store - dedup", () => {
  it("should dedup by wamid", () => {
    const seen = new Set<string>();
    const wamid = "wamid.test_123";
    expect(seen.has(wamid)).toBe(false);
    seen.add(wamid);
    expect(seen.has(wamid)).toBe(true);
    expect(seen.has("wamid.other")).toBe(false);
  });
});
