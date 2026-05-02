import { tool, type Tool } from "@/lib/external/ai/stream.service";
import { z } from "zod";
import { getAllProducts, getProduct } from "@/lib/modules/products";
import { getAllPaginas, getPagina } from "@/lib/modules/paginas";
import { getAllPosts, getPost } from "@/lib/modules/blog";
import { brand } from "@/lib/config/data/brand";
import {
  getMyHistory, saveLongMemory, getLongMemory, deleteAllMemory,
  isDerived, setDerived, resolveDerivation, getDerivedConversations,
} from "@/lib/modules/agents/session-store";
import type { ToolContext } from "./types";

function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getAiTools(context: ToolContext): Record<string, Tool> {
  const tools: Record<string, Tool> = {

    getProducts: tool({
      description: `Lista el catálogo de productos disponibles. Devuelve nombre, slug, precio, descripción corta y categoría.
INPUT: query para buscar por nombre, category para filtrar por categoría.
Usa el campo "slug" exacto para llamar a getProductDetail si el usuario pide más info.`,
      inputSchema: z.object({
        query: z.string().optional().describe("Buscar productos por nombre"),
        category: z.string().optional().describe("Filtrar por categoría exacta"),
      }),
      execute: async ({ query, category }) => {
        const products = await getAllProducts();
        let filtered = products;
        if (query) {
          const q = normalize(query);
          filtered = filtered.filter((p) => normalize(p.name).includes(q));
        }
        if (category) {
          const c = normalize(category);
          filtered = filtered.filter((p) => normalize(p.category) === c);
        }
        const cats = [...new Set(products.map((p) => p.category))];
        return {
          products: filtered.map((p) => ({
            name: p.name, slug: p.slug,
            price: typeof p.price === "number" ? `$${(p.price / 100).toFixed(2)} USD` : p.price,
            description: p.description, category: p.category,           })),
          availableCategories: cats,
        };
      },
    }),

    getProductDetail: tool({
      description: `Obtiene TODA la información detallada de UN producto usando su slug exacto.
Incluye: descripción larga, precio, variantes, imágenes, y si requiere agendamiento.
El slug debe ser exactamente el mismo que devolvió getProducts.`,
      inputSchema: z.object({ slug: z.string().describe("Slug exacto del producto") }),
      execute: async ({ slug }) => {
        const product = await getProduct(slug);
        if (!product) return { found: false, message: `Producto "${slug}" no encontrado` };
        const fmt = (v: number | undefined) => v !== undefined ? `$${(v / 100).toFixed(2)} USD` : undefined;
        return {
          found: true,
          product: {
            name: product.name, slug: product.slug,
            price: fmt(product.price), originalPrice: fmt(product.originalPrice),
            description: product.description, longDescription: product.longDescription,
            category: product.category, quantity: product.quantity, unit: product.unit,
            type: product.type, appointment: product.appointment,
            variants: product.variants,
          },
        };
      },
    }),

    getPages: tool({
      description: `Lista las páginas institucionales (términos, políticas, sobre nosotros, etc.).
INPUT: query para buscar por título/extracto, category para filtrar.
Usa getPageDetail con el slug exacto para leer el contenido completo.`,
      inputSchema: z.object({
        query: z.string().optional().describe("Buscar por título o extracto"),
        category: z.string().optional().describe("Filtrar por categoría (ej: legal, politicas)"),
      }),
      execute: async ({ query, category }) => {
        const pages = await getAllPaginas();
        let filtered = pages;
        if (query) {
          const q = normalize(query);
          filtered = filtered.filter((p) =>
            normalize(p.title).includes(q) || normalize(p.excerpt).includes(q));
        }
        if (category) {
          const c = normalize(category);
          filtered = filtered.filter((p) => normalize(p.category) === c);
        }
        return { pages: filtered.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category })) };
      },
    }),

    getPageDetail: tool({
      description: `Obtiene el contenido COMPLETO de una página usando su slug exacto.`,
      inputSchema: z.object({ slug: z.string().describe("Slug exacto de la página") }),
      execute: async ({ slug }) => {
        const page = await getPagina(slug);
        if (!page) return { found: false, message: `Página "${slug}" no encontrada` };
        return { found: true, page: { title: page.title, content: page.content, category: page.category, publishedAt: page.publishedAt } };
      },
    }),

    getBlog: tool({
      description: `Lista los artículos del blog. Devuelve slug, título, extracto, autor, categoría.
INPUT: query para buscar por título/extracto, category para filtrar.
Usa getPostDetail con el slug exacto para leer el artículo completo.`,
      inputSchema: z.object({
        query: z.string().optional().describe("Buscar por título o extracto"),
        category: z.string().optional().describe("Filtrar por categoría (ej: nutricion, entrenamiento)"),
      }),
      execute: async ({ query, category }) => {
        const posts = await getAllPosts();
        let filtered = posts;
        if (query) {
          const q = normalize(query);
          filtered = filtered.filter((p) =>
            normalize(p.title).includes(q) || normalize(p.excerpt).includes(q));
        }
        if (category) {
          const c = normalize(category);
          filtered = filtered.filter((p) => normalize(p.category) === c);
        }
        return { posts: filtered.map((p) => ({ slug: p.slug, title: p.title, excerpt: p.excerpt, author: p.author, category: p.category, publishedAt: p.publishedAt, readingTime: p.readingTime })) };
      },
    }),

    getPostDetail: tool({
      description: `Obtiene el contenido COMPLETO de un artículo del blog usando su slug exacto.`,
      inputSchema: z.object({ slug: z.string().describe("Slug exacto del artículo") }),
      execute: async ({ slug }) => {
        const post = await getPost(slug);
        if (!post) return { found: false, message: `Artículo "${slug}" no encontrado` };
        return { found: true, post: { title: post.title, content: post.content, author: post.author, category: post.category, publishedAt: post.publishedAt, readingTime: post.readingTime, tags: post.tags } };
      },
    }),

    getCompanyInfo: tool({
      description: `Obtiene datos de contacto e info general: nombre, email, teléfono, dirección, redes sociales.`,
      inputSchema: z.object({}),
      execute: async () => ({
        name: brand.name, description: brand.description,
        email: brand.email, phone: brand.phone, address: brand.address,
        country: brand.addressCountry, instagram: brand.socialInstagram,
        facebook: brand.socialFacebook, twitter: brand.socialTwitter,
        youtube: brand.socialYoutube,
      }),
    }),

    saveLongMemory: tool({
      description: `Guarda información del cliente en memoria permanente (alergias, preferencias, tallas, nombre, etc).
INPUT: key = nombre del dato, value = valor, override = sobrescribir si ya existe (default false).`,
      inputSchema: z.object({
        key: z.string().describe("Nombre del dato (ej: alergias, nombre, talla_ropa)"),
        value: z.string().describe("Valor del dato"),
        override: z.boolean().optional().default(false).describe("Sobrescribir si ya existe"),
      }),
      execute: async ({ key, value, override }) => {
        const existing = await getLongMemory(context.phone);
        if (!override && key in existing) {
          return { success: false, message: `"${key}" ya existe: "${existing[key]}". Usa override=true.`, currentValue: existing[key] };
        }
        await saveLongMemory(context.phone, { [key]: value });
        return { success: true, message: `Recordado: ${key} = ${value}` };
      },
    }),

    searchMyHistory: tool({
      description: `Busca en el historial de mensajes previos de este cliente.`,
      inputSchema: z.object({ limit: z.number().optional().default(10).describe("Cantidad de mensajes") }),
      execute: async ({ limit = 10 }) => {
        const history = await getMyHistory(context.phone);
        const recent = history.slice(-limit);
        return { history: recent.map((m) => ({ role: m.role, content: typeof m.content === "string" ? m.content : "[multimedia]" })), total: history.length };
      },
    }),

    deleteMemory: tool({
      description: `ELIMINA TODOS LOS DATOS DEL CLIENTE. PASO 1: llama con el texto exacto del usuario. Devuelve confirmación. PASO 2: si responde "BORRAR", ejecuta.`,
      inputSchema: z.object({
        confirm: z.string().describe('Texto de confirmación. Si es "BORRAR" ejecuta, si no devuelve error.'),
      }),
      execute: async ({ confirm }) => {
        if (confirm !== "BORRAR") {
          return { success: false, message: 'Debes escribir "BORRAR" para confirmar.' };
        }
        const deleted = await deleteAllMemory(context.phone);
        return { success: true, message: "Todos tus datos han sido eliminados.", keys: deleted };
      },
    }),

    deriveToHuman: tool({
      description: `⚠️ DERIVA AL USUARIO A UN HUMANO. Llama esta tool SOLO cuando:
- El usuario pide algo que NO puedes hacer (comprar, agendar, crear reseñas, etc.)
- El usuario requiere asistencia humana personalizada
- No encuentras la información que pide en las tools disponibles

EFECTO: El chat se bloquea por 24h para el agente. Un administrador revisará y retomará.
INPUT: reason = motivo de la derivación (describe qué necesita el usuario).`,
      inputSchema: z.object({
        reason: z.string().describe("Motivo claro de la derivación: qué necesita el usuario"),
      }),
      execute: async ({ reason }) => {
        await setDerived(context.phone, reason);
        const { notifyAdmin } = await import("@/lib/external/whatsapp/send");
        notifyAdmin(`🔔 Derivación solicitada: ${context.phone} - ${reason}`);
        return { success: true, message: `Has sido transferido a un asesor humano. En breve te atenderemos. Motivo: ${reason}` };
      },
    }),
  };

  // ─── Admin-only tools ──────────────────────────────────

  if (context.isAdmin) {
    const adminTools: Record<string, Tool> = {

      getDerivedConversations: tool({
        description: "Lista todas las conversaciones derivadas a humano pendientes.",
        inputSchema: z.object({}),
        execute: async () => {
          const list = await getDerivedConversations();
          return { derived: list };
        },
      }),

      resolveDerivation: tool({
        description: "Resuelve una derivación: libera el chat para que el agente vuelva a responder automáticamente.",
        inputSchema: z.object({
          phone: z.string().describe("Número de teléfono del usuario a liberar"),
        }),
        execute: async ({ phone }) => {
          const ok = await resolveDerivation(phone);
          return { success: ok, message: ok ? `Derivación liberada para ${phone}.` : "No se pudo liberar." };
        },
      }),

      findChatByPhone: tool({
        description: `Busca una sesión de chat por número de teléfono. Útil para que el admin retome conversaciones derivadas.
INPUT: phone = número de teléfono completo (ej: 593991234567).
Devuelve: información de la sesión y el historial reciente.`,
        inputSchema: z.object({
          phone: z.string().describe("Número de teléfono completo (ej: 593991234567)"),
        }),
        execute: async ({ phone }) => {
          const { getSession, anonymizePhone } = await import("@/lib/modules/agents/session-store");
          const anonymized = await anonymizePhone(phone);
          const session = await getSession(phone);
          if (!session) return { found: false, message: "No se encontró sesión para ese número.", anonymized };
          return {
            found: true, anonymized,
            session: {
              name: session.name, createdAt: session.createdAt, lastActivity: session.lastActivity,
              history: session.history.slice(-20).map((m) => ({
                role: m.role, content: typeof m.content === "string" ? m.content.substring(0, 500) : "[multimedia]",
              })),
              historyCount: session.history.length,
            },
          };
        },
      }),
    };

    Object.assign(tools, adminTools);
  }

  return tools;
}
