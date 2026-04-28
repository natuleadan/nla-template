import { tool, type Tool } from "@/lib/external/ai/stream.service";
import { z } from "zod";
import { getAllProducts, getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { getAllPaginas, getPagina } from "@/lib/modules/paginas";
import { getAllPosts, getPost } from "@/lib/modules/blog";
import { getWeekDays, getDayByName } from "@/lib/modules/agenda";
import { brand } from "@/lib/config/data/brand";
import {
  getMyHistory, saveLongMemory, getLongMemory, deleteAllMemory,
} from "@/lib/modules/agents/session-store";
import type { ToolContext } from "./types";

function normalize(str: string): string {
  return str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function getAiTools(context: ToolContext): Record<string, Tool> {
  const tools: Record<string, Tool> = {

    getProducts: tool({
      description: `Obtiene el catálogo de productos disponibles. Devuelve información básica (nombre, slug, precio, descripción corta y categoría).
Usa esta herramienta para:
- Listar productos, precios y categorías
- Filtrar por nombre (query) o categoría (category)
- Explorar qué vende la tienda

INPUT: query para buscar por nombre, category para filtrar por categoría.
CRÍTICO: De los resultados, usa el campo "slug" exactamente como aparece para llamar a getProductDetail si el usuario pide más información de un producto.`,
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
            name: p.name,
            slug: p.slug,
            price: p.price,
            description: p.description,
            category: p.category,
          })),
          availableCategories: cats,
        };
      },
    }),

    getProductDetail: tool({
      description: `Obtiene TODA la información detallada de UN producto específico usando su slug exacto.
Incluye: descripción larga, precio, imágenes disponibles, reseñas de clientes con valoraciones y comentarios, y si requiere agendamiento.
Usa esta herramienta cuando el usuario pida más detalles de un producto que ya apareció en getProducts.
IMPORTANTE: El slug debe ser exactamente el mismo que devolvió getProducts, no lo inventes.`,

      inputSchema: z.object({ slug: z.string().describe("Slug exacto del producto (tomado de getProducts)") }),
      execute: async ({ slug }) => {
        const product = await getProduct(slug);
        if (!product) {
          return { found: false, message: `No se encontró el producto con slug "${slug}"` };
        }
        const reviews = await getReviews(product.slug);
        return {
          found: true,
          product: {
            name: product.name,
            slug: product.slug,
            price: product.price,
            originalPrice: product.originalPrice,
            description: product.description,
            longDescription: product.longDescription,
            category: product.category,
            quantity: product.quantity,
            unit: product.unit,
            type: product.type,
            appointment: product.appointment,
          },
          reviews: reviews
            .filter((r) => r.status === "published")
            .map((r) => ({
              name: r.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt,
            })),
        };
      },
    }),

    getPages: tool({
      description: `Lista las páginas institucionales disponibles (términos, políticas, sobre nosotros, etc.).
Devuelve: slug, título, extracto y categoría de cada página (sin contenido completo).
Usa esta herramienta para averiguar qué páginas existen y luego llama a getPageDetail con el slug exacto para leer el contenido completo.
INPUT: query para buscar por título/extracto, category para filtrar por categoría.`,

      inputSchema: z.object({
        query: z.string().optional().describe("Buscar páginas por título o extracto"),
        category: z.string().optional().describe("Filtrar por categoría (ej: legal, politicas)"),
      }),
      execute: async ({ query, category }) => {
        const pages = await getAllPaginas();
        let filtered = pages;
        if (query) {
          const q = normalize(query);
          filtered = filtered.filter((p) =>
            normalize(p.title).includes(q) || normalize(p.excerpt).includes(q),
          );
        }
        if (category) {
          const c = normalize(category);
          filtered = filtered.filter((p) => normalize(p.category) === c);
        }
        return {
          pages: filtered.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            category: p.category,
          })),
        };
      },
    }),

    getPageDetail: tool({
      description: `Obtiene el contenido COMPLETO de una página institucional específica usando su slug exacto (tomado de getPages).
Devuelve: título completo, contenido HTML, categoría y fecha de publicación.
Usa esta herramienta cuando el usuario quiera leer una página específica que apareció en getPages.`,

      inputSchema: z.object({ slug: z.string().describe("Slug exacto de la página (tomado de getPages)") }),
      execute: async ({ slug }) => {
        const page = await getPagina(slug);
        if (!page) {
          return { found: false, message: `No se encontró la página con slug "${slug}"` };
        }
        return {
          found: true,
          page: {
            title: page.title,
            content: page.content,
            category: page.category,
            publishedAt: page.publishedAt,
          },
        };
      },
    }),

    getBlog: tool({
      description: `Lista los artículos del blog disponibles.
Devuelve: slug, título, extracto, autor, categoría, fecha de publicación y tiempo de lectura (sin contenido completo).
Usa esta herramienta para buscar artículos y luego llama a getPostDetail con el slug exacto para leer el artículo completo.
INPUT: query para buscar por título/extracto, category para filtrar por categoría.`,

      inputSchema: z.object({
        query: z.string().optional().describe("Buscar artículos por título o extracto"),
        category: z.string().optional().describe("Filtrar por categoría (ej: nutricion, entrenamiento, salud)"),
      }),
      execute: async ({ query, category }) => {
        const posts = await getAllPosts();
        let filtered = posts;
        if (query) {
          const q = normalize(query);
          filtered = filtered.filter((p) =>
            normalize(p.title).includes(q) || normalize(p.excerpt).includes(q),
          );
        }
        if (category) {
          const c = normalize(category);
          filtered = filtered.filter((p) => normalize(p.category) === c);
        }
        return {
          posts: filtered.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            author: p.author,
            category: p.category,
            publishedAt: p.publishedAt,
            readingTime: p.readingTime,
          })),
        };
      },
    }),

    getPostDetail: tool({
      description: `Obtiene el contenido COMPLETO de un artículo del blog específico usando su slug exacto (tomado de getBlog).
Devuelve: título completo, contenido HTML, autor, categoría, fecha de publicación y etiquetas.
Usa esta herramienta cuando el usuario quiera leer un artículo completo que apareció en getBlog.`,

      inputSchema: z.object({ slug: z.string().describe("Slug exacto del artículo (tomado de getBlog)") }),
      execute: async ({ slug }) => {
        const post = await getPost(slug);
        if (!post) {
          return { found: false, message: `No se encontró el artículo con slug "${slug}"` };
        }
        return {
          found: true,
          post: {
            title: post.title,
            content: post.content,
            author: post.author,
            category: post.category,
            publishedAt: post.publishedAt,
            readingTime: post.readingTime,
            tags: post.tags,
          },
        };
      },
    }),

    getAgenda: tool({
      description: `Obtiene los horarios disponibles por día para agendar servicios.
Usa esta herramienta cuando el usuario pregunte por:
- Horarios disponibles para agendar
- Agenda del día (pasa el día exacto en español: "Lunes", "Martes", etc.)
- Días y horarios de atención

INPUT: day opcional con el nombre del día en español (ej: "Lunes", "Martes").
Si no se pasa día, devuelve la semana completa.`,

      inputSchema: z.object({ day: z.string().optional().describe("Nombre del día en español (ej: Lunes, Martes)") }),
      execute: async ({ day }) => {
        if (day) {
          const d = await getDayByName(day);
          if (!d) return { found: false, message: `No hay agenda para "${day}"` };
          return {
            days: [{
              name: d.name,
              slots: d.slots.filter((s) => s.available).map((s) => ({
                time: s.time, type: s.type || "general",
              })),
            }],
          };
        }
        const days = await getWeekDays();
        return {
          days: days.map((d) => ({
            name: d.name,
            slots: d.slots.filter((s) => s.available).map((s) => ({
              time: s.time, type: s.type || "general",
            })),
          })),
        };
      },
    }),

    getCompanyInfo: tool({
      description: `Obtiene los datos de contacto e información general de la empresa.
Usa esta herramienta cuando el usuario pregunte por:
- Nombre, descripción, email, teléfono, dirección y país
- Redes sociales: Instagram, Facebook, Twitter/X, YouTube`,

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
      description: `Guarda información del cliente en memoria permanente. Obligatorio usarla cuando el cliente mencione datos personales que debamos recordar entre conversaciones: nombre, alergias, preferencias, tallas, fechas importantes, ubicación, restricciones alimenticias, etc.

INPUT: key = nombre del dato (ej: "alergias", "talla_ropa", "nombre"), value = valor del dato, override = si debe sobrescribir un valor existente (default false).
Si el key ya existe y override=false, devuelve el valor actual sin sobrescribir.`,

      inputSchema: z.object({
        key: z.string().describe("Nombre del dato a guardar (ej: alergias, nombre, talla_ropa, preferencia)"),
        value: z.string().describe("Valor del dato a recordar"),
        override: z.boolean().optional().default(false).describe("Sobrescribir si ya existe"),
      }),
      execute: async ({ key, value, override }) => {
        const existing = await getLongMemory(context.phone);
        if (!override && key in existing) {
          return {
            success: false, message: `El dato "${key}" ya existe: "${existing[key]}". Usa override=true para sobrescribir.`,
            currentValue: existing[key],
          };
        }
        await saveLongMemory(context.phone, { [key]: value });
        return { success: true, message: `Recordado: ${key} = ${value}` };
      },
    }),

    searchMyHistory: tool({
      description: `Busca en el historial de conversaciones previas de este cliente.
Usa esta herramienta cuando el usuario pregunte por algo que hablamos antes, quiera retomar un tema, o necesite recordar información dicha en conversaciones anteriores.
INPUT: limit opcional (cantidad de mensajes, default 10).
Devuelve: últimos mensajes del historial.`,

      inputSchema: z.object({ limit: z.number().optional().default(10).describe("Cantidad de mensajes a recuperar") }),
      execute: async ({ limit = 10 }) => {
        const history = await getMyHistory(context.phone);
        const recent = history.slice(-limit);
        return {
          history: recent.map((m) => ({
            role: m.role,
            content: typeof m.content === "string" ? m.content : "[contenido multimedia]",
          })),
          total: history.length,
        };
      },
    }),

    deleteMemory: tool({
      description: `ELIMINA TODOS LOS DATOS DEL CLIENTE. Llámame cuando el usuario pida borrar/olvidar/resetear. PASO 1: llama con el texto exacto que dijo el usuario. El tool devuelve instrucción de confirmación. PASO 2: El usuario responde, vuelve a llamarme con su texto. Si es "BORRAR" ejecuto, si no, devuelvo error.`,

      inputSchema: z.object({
        confirm: z.string().describe('Texto de confirmación del usuario en cada intento. El tool valida si es "BORRAR".'),
      }),
      execute: async ({ confirm }) => {
        if (confirm !== "BORRAR") {
          return { success: false, message: 'Debes escribir exactamente "BORRAR" para confirmar la eliminación de todos tus datos.' };
        }
        const deleted = await deleteAllMemory(context.phone);
        return { success: true, message: "Todos tus datos han sido eliminados.", keys: deleted };
      },
    }),
  };

  return tools;
}
