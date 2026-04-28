import { tool, type Tool } from "@/lib/external/ai/stream.service";
import { z } from "zod";
import { getAllProducts, getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { getAllPaginas } from "@/lib/modules/paginas";
import { getAllPosts } from "@/lib/modules/blog";
import { getWeekDays, getDayByName } from "@/lib/modules/agenda";
import { brand } from "@/lib/config/data/brand";
import {
  getMyHistory, saveLongMemory, getLongMemory, deleteAllMemory,
} from "@/lib/modules/agents/session-store";
import {
  GetItemsInputSchema, GetDetailInputSchema,
  SearchHistoryInputSchema, GetAgendaInputSchema, SaveLongMemoryInputSchema,
} from "@/lib/modules/agents/schemas";
import type { ToolContext } from "./types";

export function getAiTools(context: ToolContext): Record<string, Tool> {
  const tools: Record<string, Tool> = {

    getProducts: tool({
      description: `Obtiene el catálogo de productos disponible en la tienda.
Usa esta herramienta cuando el usuario pregunte por:
- Lista de productos disponibles
- Precios de productos
- Qué venden en la tienda
- Productos por categoría o nombre
- Explorar categorías disponibles

INPUT: query (búsqueda por nombre), category (filtrar por categoría).
Devuelve: productos filtrados + lista de categorías disponibles.`,
      parameters: GetItemsInputSchema,
      execute: async ({ query, category }) => {
        const products = await getAllProducts();
        let filtered = products;
        if (query) {
          filtered = filtered.filter((p) =>
            p.name.toLowerCase().includes(query.toLowerCase()),
          );
        }
        if (category) {
          filtered = filtered.filter((p) =>
            p.category.toLowerCase() === category.toLowerCase(),
          );
        }
        const cats = [...new Set(products.map((p) => p.category))];
        return {
          products: filtered.map((p) => ({
            name: p.name, slug: p.slug, quantity: p.quantity,
            unit: p.unit, price: p.price, originalPrice: p.originalPrice,
            description: p.description, category: p.category,
            image: p.image, type: p.type, appointment: p.appointment,
          })),
          availableCategories: cats,
        };
      },
    }),

    getProductDetail: tool({
      description: `Obtiene información detallada de un producto específico por su slug.
Incluye reseñas y valoraciones de otros clientes.
Devuelve: descripción completa, precio, imágenes, categoría, reseñas, y si requiere agendamiento.`,
      parameters: GetDetailInputSchema,
      execute: async ({ slug }) => {
        const product = await getProduct(slug);
        if (!product) {
          return { found: false, message: `No se encontró el producto "${slug}"` };
        }
        const reviews = await getReviews(product.slug);
        return {
          found: true,
          product: {
            name: product.name, slug: product.slug,
            price: product.price, originalPrice: product.originalPrice,
            description: product.description, longDescription: product.longDescription,
            category: product.category, quantity: product.quantity, unit: product.unit,
            image: product.image, images: product.images,
            type: product.type, appointment: product.appointment,
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
      description: `Obtiene el listado de páginas institucionales del sitio.
Usa esta herramienta cuando el usuario pregunte por:
- Información de la empresa
- Términos y condiciones
- Políticas de envío
- Preguntas frecuentes
- Sobre nosotros
- Cualquier página de contenido estático

INPUT: query (búsqueda por título/extracto), category (filtrar por categoría).
Devuelve: páginas con título, extracto, contenido y categoría.`,
      parameters: GetItemsInputSchema,
      execute: async ({ query, category }) => {
        const pages = await getAllPaginas();
        let filtered = pages;
        if (query) {
          filtered = filtered.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(query.toLowerCase()),
          );
        }
        if (category) {
          filtered = filtered.filter((p) =>
            p.category.toLowerCase() === category.toLowerCase(),
          );
        }
        return {
          pages: filtered.map((p) => ({
            title: p.title, excerpt: p.excerpt,
            content: p.content, category: p.category,
          })),
        };
      },
    }),

    getBlog: tool({
      description: `Obtiene los artículos y publicaciones del blog.
Usa esta herramienta cuando el usuario pregunte por:
- Artículos o publicaciones del blog
- Noticias
- Consejos o tutoriales
- Información educativa

INPUT: query (búsqueda por título/extracto), category (filtrar por categoría).
Devuelve: posts con título, extracto, autor, categoría y tiempo de lectura.`,
      parameters: GetItemsInputSchema,
      execute: async ({ query, category }) => {
        const posts = await getAllPosts();
        let filtered = posts;
        if (query) {
          filtered = filtered.filter((p) =>
            p.title.toLowerCase().includes(query.toLowerCase()) ||
            p.excerpt.toLowerCase().includes(query.toLowerCase()),
          );
        }
        if (category) {
          filtered = filtered.filter((p) =>
            p.category.toLowerCase() === category.toLowerCase(),
          );
        }
        return {
          posts: filtered.map((p) => ({
            title: p.title, excerpt: p.excerpt, author: p.author,
            category: p.category, publishedAt: p.publishedAt,
            readingTime: p.readingTime,
          })),
        };
      },
    }),

    getAgenda: tool({
      description: `Obtiene la agenda y horarios disponibles.
Usa esta herramienta cuando el usuario pregunte por:
- Horarios disponibles
- Agenda del día (pasa el día como parámetro, ej: "Lunes")
- Disponibilidad para agendar una cita
- Días y horarios de atención

INPUT: day opcional (nombre del día en español, ej: "Lunes", "Martes").
Devuelve: días con horarios disponibles.`,
      parameters: GetAgendaInputSchema,
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
      description: `Obtiene información general de la empresa.
Usa esta herramienta cuando el usuario pregunte por:
- Datos de contacto
- Dirección
- Redes sociales
- Correo electrónico
- Teléfono
- Información general del negocio`,
      parameters: z.object({}),
      execute: async () => ({
        name: brand.name, description: brand.description,
        email: brand.email, phone: brand.phone, address: brand.address,
        country: brand.addressCountry, instagram: brand.socialInstagram,
        facebook: brand.socialFacebook, twitter: brand.socialTwitter,
        youtube: brand.socialYoutube,
      }),
    }),

    saveLongMemory: tool({
      description: `Guarda información importante del cliente en memoria permanente (1 año).
Usa esta herramienta cuando el cliente mencione datos relevantes como:
- Alergias o condiciones médicas
- Preferencias de productos (talla,色, sabor)
- Fechas importantes (cumpleaños, aniversarios)
- Datos de contacto adicionales
- Cualquier información que el cliente quiera que recordemos

INPUT: key (nombre del dato), value (valor), override (si sobreescribe un key existente).
Si el key ya existe y override=false, no se sobreescribe y se devuelve el valor actual.`,
      parameters: SaveLongMemoryInputSchema,
      execute: async ({ key, value, override }) => {
        const existing = await getLongMemory(context.phone);
        if (!override && key in existing) {
          return {
            success: false, message: `El dato "${key}" ya existe: "${existing[key]}". Usa override=true para sobreescribir.`,
            currentValue: existing[key],
          };
        }
        await saveLongMemory(context.phone, { [key]: value });
        return { success: true, message: `Recordado: ${key} = ${value}` };
      },
    }),

    searchMyHistory: tool({
      description: `Busca en el historial de conversaciones anteriores de este mismo cliente.
Usa esta herramienta cuando el usuario pregunte por:
- Lo que hablamos antes
- Conversaciones pasadas
- Información que ya me dieron en otro chat
- Historial de nuestra conversación
- Retomar un tema anterior

INPUT: limit opcional (cantidad de mensajes a recuperar, default 10).
Devuelve: los últimos mensajes del historial con su rol (usuario/asistente).`,
      parameters: SearchHistoryInputSchema,
      execute: async ({ limit = 10 }) => {
        const history = await getMyHistory(context.phone);
        const recent = history.slice(-limit);
        return {
          history: recent.map((m) => ({
            role: m.role,
            content: typeof m.content === "string"
              ? m.content
              : "[imagen o contenido multimedia]",
          })),
          total: history.length,
        };
      },
    }),

    deleteMemory: tool({
      description: `ELIMINA TODA la información almacenada de este cliente: historial de conversación, memoria permanente, y cola de mensajes pendientes.
Usa esta herramienta SOLO cuando el cliente lo solicite explícitamente (ej: "olvida todo lo que hablamos", "borra mis datos", "reset").

INPUT: confirm (debe ser exactamente "BORRAR" para ejecutar).
Devuelve: lista de claves eliminadas.`,
      parameters: z.object({
        confirm: z.string().describe('Escribe "BORRAR" para confirmar la eliminación de todos los datos'),
      }),
      execute: async ({ confirm }) => {
        if (confirm !== "BORRAR") {
          return { success: false, message: 'Debes escribir "BORRAR" para confirmar.' };
        }
        const deleted = await deleteAllMemory(context.phone);
        return { success: true, message: "Todos tus datos han sido eliminados.", keys: deleted };
      },
    }),
  };

  return tools;
}
