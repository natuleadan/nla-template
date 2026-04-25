import { NextResponse } from "next/server";
import {
  validateApiKey,
  unauthorized,
  badRequest,
  serverError,
} from "@/lib/config/env";
import { getFormMessages, addFormMessage } from "@/lib/modules/form";

export async function GET(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  const messages = await getFormMessages();
  return NextResponse.json(messages);
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data || typeof data !== "object")
      return badRequest("Cuerpo JSON requerido");

    if (
      !data.nombre ||
      typeof data.nombre !== "string" ||
      data.nombre.trim().length === 0
    ) {
      return badRequest("El campo 'nombre' es requerido (string, no vacío)");
    }
    if (
      !data.email ||
      typeof data.email !== "string" ||
      data.email.trim().length === 0
    ) {
      return badRequest("El campo 'email' es requerido (string, no vacío)");
    }
    if (!data.email.includes("@") || !data.email.includes(".")) {
      return badRequest("El campo 'email' debe ser un email válido");
    }
    if (
      !data.mensaje ||
      typeof data.mensaje !== "string" ||
      data.mensaje.trim().length === 0
    ) {
      return badRequest("El campo 'mensaje' es requerido (string, no vacío)");
    }

    const formData = await addFormMessage({
      nombre: data.nombre.trim(),
      email: data.email.trim(),
      mensaje: data.mensaje.trim(),
    });

    return NextResponse.json({
      success: true,
      message: "Mensaje enviado correctamente",
      data: formData,
    });
  } catch (error) {
    if (error instanceof SyntaxError)
      return badRequest("JSON inválido en el cuerpo");
    return serverError(error);
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized();

  try {
    const body = await request.json();
    if (!body || typeof body !== "object")
      return badRequest("Cuerpo JSON requerido");
    return NextResponse.json({ message: "Formularios actualizados", ...body });
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido");
    return serverError(error);
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized();
  return NextResponse.json({ message: "Formularios eliminados" });
}
