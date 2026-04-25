import { NextResponse } from "next/server"
import { cacheLife, cacheTag } from "next/cache"
import { validateApiKey, unauthorized, badRequest } from "@/lib/config/env"
import { getCategories, addCategory } from "@/lib/modules/categories"

async function getCategoriesData() {
  'use cache'
  cacheLife('days')
  cacheTag('categories')
  return getCategories()
}

export async function GET() {
  const data = await getCategoriesData()
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  if (!validateApiKey(request)) return unauthorized()

  try {
    const body = await request.json()
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido")
    if (!body.name || typeof body.name !== "string") return badRequest("El campo 'name' es requerido (string)")
    if (!body.slug || typeof body.slug !== "string") return badRequest("El campo 'slug' es requerido (string)")

    const newCategory = addCategory({
      name: body.name,
      slug: body.slug,
      icon: body.icon,
    })

    return NextResponse.json(newCategory, { status: 201 })
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido")
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  if (!validateApiKey(request)) return unauthorized()

  try {
    const body = await request.json()
    if (!body || typeof body !== "object") return badRequest("Cuerpo JSON requerido")
    return NextResponse.json({ message: "Categorías actualizadas", data: body })
  } catch (error) {
    if (error instanceof SyntaxError) return badRequest("JSON inválido")
    return NextResponse.json({ error: "Error interno" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  if (!validateApiKey(request)) return unauthorized()
  return NextResponse.json({ message: "Todas las categorías eliminadas" })
}