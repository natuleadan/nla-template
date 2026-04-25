function getEnv(name: string, fallback?: string): string {
  const value = process.env[name] || fallback;
  if (!value) {
    throw new Error(`Environment variable ${name} is not set`);
  }
  return value;
}

export function getApiKey(): string {
  return getEnv("API_KEY", "dev-key-change-in-production");
}

export function getBaseUrl(): string {
  return getEnv("NEXT_PUBLIC_BASE_URL", "http://localhost:3000");
}

export function getWhatsappNumber(): string {
  return getEnv("NEXT_PUBLIC_WHATSAPP_NUMBER", "1234567890");
}

export function validateApiKey(request: Request): boolean {
  const authHeader = request.headers.get("x-api-key");
  return authHeader === getApiKey();
}

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
  console.error("Server error:", error);
  return Response.json(
    { error: "Error interno del servidor" },
    { status: 500 },
  );
}
