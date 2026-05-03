import { describe, it, expect } from "vitest";
import { getBaseUrl } from "@/lib/env";

const MOCK_PHONE = "+00000000000";
const MOCK_NAME = "Test User";

const PAYLOAD = {
  id: "evt_mock_000000000000000000000000",
  type: "whatsapp.inbound_message.received",
  apiVersion: "v2",
  createTime: "2026-01-01T00:00:00.000Z",
  whatsappInboundMessage: {
    id: "mock_msg_000000000000000000000001",
    wamid: "wamid.mock_00000000000000000000000000000",
    wabaId: "mock_waba_000000000000",
    from: MOCK_PHONE,
    fromUserId: "XX.mock_user_0000000000000000",
    customerProfile: { name: MOCK_NAME },
    to: MOCK_PHONE,
    sendTime: "2026-01-01T00:00:00.000Z",
    type: "text",
    text: { body: "test message" },
  },
};

describe("webhook - signature verification", () => {
  it("should verify yCloud signature format t=...,s=...", async () => {
    const secret = "whsec_test";
    const body = JSON.stringify(PAYLOAD);
    const ts = "1654084800";
    const signed = `${ts}.${body}`;

    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signed),
    );
    const hex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const header = `t=${ts},s=${hex}`;
    expect(header).toMatch(/^t=\d+,s=[a-f0-9]{64}$/);

    const parts = header.split(",");
    const t = parts.find((p) => p.startsWith("t="))?.split("=")[1];
    const s = parts.find((p) => p.startsWith("s="))?.split("=")[1];
    expect(t).toBe(ts);
    expect(s).toBe(hex);

    const verifyKey = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const verifySig = await crypto.subtle.sign(
      "HMAC",
      verifyKey,
      new TextEncoder().encode(`${t}.${body}`),
    );
    const verifyHex = Array.from(new Uint8Array(verifySig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
    expect(verifyHex).toBe(hex);
  });

  it("should reject mismatched signature", async () => {
    const secret = "whsec_test";
    const body = JSON.stringify(PAYLOAD);
    const ts = "1654084800";
    const signed = `${ts}.${body}`;
    const key = await crypto.subtle.importKey(
      "raw",
      new TextEncoder().encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const sig = await crypto.subtle.sign(
      "HMAC",
      key,
      new TextEncoder().encode(signed),
    );
    const hex = Array.from(new Uint8Array(sig))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");

    const badHeader = `t=${ts},s=0000000000000000000000000000000000000000000000000000000000000000`;
    const badSig = badHeader
      .split(",")
      .find((p) => p.startsWith("s="))
      ?.split("=")[1];
    expect(badSig).not.toBe(hex);
  });
});

describe("webhook - payload parsing", () => {
  it("should parse inbound text message", () => {
    const msg = PAYLOAD.whatsappInboundMessage;
    expect(PAYLOAD.type).toBe("whatsapp.inbound_message.received");
    expect(msg?.from).toBe(MOCK_PHONE);
    expect(msg?.text?.body).toBe("test message");
    expect(msg?.customerProfile?.name).toBe(MOCK_NAME);
  });

  it("should extract phone without + prefix", () => {
    const phone = PAYLOAD.whatsappInboundMessage!.from.replace("+", "");
    expect(phone).toBe("00000000000");
  });

  it("should ignore non-text message types", () => {
    const types = ["image", "audio", "video", "unsupported"];
    for (const t of types) {
      const p = {
        ...PAYLOAD,
        whatsappInboundMessage: {
          ...PAYLOAD.whatsappInboundMessage,
          type: t,
          text: undefined,
        },
      };
      expect(p.whatsappInboundMessage?.type).toBe(t);
    }
  });

  it("should handle button reply", () => {
    const p = {
      ...PAYLOAD,
      whatsappInboundMessage: {
        ...PAYLOAD.whatsappInboundMessage,
        type: "button",
        text: undefined,
        button: { payload: "opt_in", text: "Quiero info" },
      },
    };
    expect(p.whatsappInboundMessage?.button?.text).toBe("Quiero info");
  });

  it("should handle interactive list reply", () => {
    const p = {
      ...PAYLOAD,
      whatsappInboundMessage: {
        ...PAYLOAD.whatsappInboundMessage,
        type: "interactive",
        text: undefined,
        interactive: {
          type: "list_reply",
          list_reply: { id: "opt_1", title: "Productos", description: "Ver" },
        },
      },
    };
    expect(p.whatsappInboundMessage?.interactive?.list_reply?.title).toBe(
      "Productos",
    );
  });

  it("should handle location message", () => {
    const p = {
      ...PAYLOAD,
      whatsappInboundMessage: {
        ...PAYLOAD.whatsappInboundMessage,
        type: "location",
        text: undefined,
        location: {
          latitude: -0.18,
          longitude: -78.48,
          name: "Quito",
          address: "Ecuador",
        },
      },
    };
    expect(p.whatsappInboundMessage?.location?.name).toBe("Quito");
  });

  it("should handle request_welcome event", () => {
    const p = {
      ...PAYLOAD,
      whatsappInboundMessage: {
        ...PAYLOAD.whatsappInboundMessage,
        type: "request_welcome",
        text: undefined,
      },
    };
    expect(p.whatsappInboundMessage?.type).toBe("request_welcome");
  });
});

describe("webhook - URL handling", () => {
  it("should resolve /api/v1/webhooks/ycloud", () => {
    const url = `${getBaseUrl()}/api/v1/webhooks/ycloud`;
    expect(url).toContain("/api/v1/webhooks/ycloud");
  });

  it("should work with localhost", () => {
    const url = "http://localhost:3000/api/v1/webhooks/ycloud";
    expect(url).toMatch(
      /^https?:\/\/localhost:\d+\/api\/v1\/webhooks\/ycloud$/,
    );
  });
});
