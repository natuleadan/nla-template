import { isDev } from "@/lib/env.public";

export function unauthorized(): Response {
  return Response.json(
    { error: "No autorizado. Provee header x-api-key." },
    { status: 401 },
  );
}

export function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export function notFound(entity: string): Response {
  return Response.json({ error: `${entity} no encontrado` }, { status: 404 });
}

export function serverError(error: unknown): Response {
  if (isDev) console.error("Server error:", error);
  return Response.json(
    { error: "Error interno del servidor" },
    { status: 500 },
  );
}
