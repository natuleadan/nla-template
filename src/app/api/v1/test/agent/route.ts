import { NextRequest } from "next/server";
import { AgentService } from "@/lib/modules/agents/service";
import { isRedisConfigured } from "@/lib/external/upstash/redis";

export async function POST(req: NextRequest) {
  try {
    const { message, phone = "test_00000000000" } = await req.json();
    if (!message || typeof message !== "string") {
      return Response.json({ error: "message es requerido (string)" }, { status: 400 });
    }

    const response = await AgentService.processMessage(message, {
      phone,
      customerName: "Test User",
    });

    const result = { success: true, response, phone, redis: isRedisConfigured(), len: response?.length };
    if (typeof response !== "string" || response.length === 0) {
      (result as Record<string, unknown>).type = typeof response;
    }
    return Response.json(result);
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return Response.json({ success: false, error: msg }, { status: 500 });
  }
}
