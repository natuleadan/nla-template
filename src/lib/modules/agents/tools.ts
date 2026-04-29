import { tool, type Tool } from "@/lib/external/ai/stream.service";
import { z } from "zod";
import { getAllProducts, getProduct, getAllProductsWithStock, enrichProductWithStock } from "@/lib/modules/products";
import { getReviews, getApprovedReviews, createRedisReview, getPendingReviews, approveReview, rejectReview, setReviewVisibility, getMyReviews } from "@/lib/modules/reviews";
import { getApprovedComments, createRedisComment, getPendingComments, approveComment, rejectComment, setCommentVisibility, getMyComments } from "@/lib/modules/comments";
import { getAllPaginas, getPagina } from "@/lib/modules/paginas";
import { getAllPosts, getPost } from "@/lib/modules/blog";
import { getWeekDays, getDayByName, getAvailableSlots, createAppointment, getMyAppointments, getAllAppointments, getAppointmentDetail, updateApptStatus } from "@/lib/modules/agenda";
import { createBusOrder, getMyOrders, getAllOrders, getOrderDetail, updateOrderStatus, setOrderDeliveryGps } from "@/lib/modules/orders";
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
        const products = await getAllProductsWithStock();
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
            price: typeof p.price === "number" ? `$${(p.price / 100).toFixed(2)} USD` : p.price,
            description: p.description,
            category: p.category,
            stock: p.stock,
          })),
          availableCategories: cats,
        };
      },
    }),

    getProductDetail: tool({
      description: `Obtiene TODA la información detallada de UN producto específico usando su slug exacto.
Incluye: descripción larga, precio, variantes con stock, imágenes disponibles, reseñas de clientes con valoraciones y comentarios, y si requiere agendamiento.
Usa esta herramienta cuando el usuario pida más detalles de un producto que ya apareció en getProducts.
IMPORTANTE: El slug debe ser exactamente el mismo que devolvió getProducts, no lo inventes.`,

      inputSchema: z.object({ slug: z.string().describe("Slug exacto del producto (tomado de getProducts)") }),
      execute: async ({ slug }) => {
        const product = await getProduct(slug);
        if (!product) {
          return { found: false, message: `No se encontró el producto con slug "${slug}"` };
        }
        const enriched = await enrichProductWithStock(product);
        const reviews = await getApprovedReviews(product.slug);
        const fmt = (v: number | undefined) => v !== undefined ? `$${(v / 100).toFixed(2)} USD` : undefined;
        return {
          found: true,
          product: {
            name: enriched.name,
            slug: enriched.slug,
            price: fmt(enriched.price),
            originalPrice: fmt(enriched.originalPrice),
            description: enriched.description,
            longDescription: enriched.longDescription,
            category: enriched.category,
            quantity: enriched.quantity,
            unit: enriched.unit,
            type: enriched.type,
            appointment: enriched.appointment,
            variants: enriched.variants,
            stock: enriched.stock,
          },
          reviews: reviews.map((r) => ({
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
      description: `Obtiene los horarios disponibles por día para servicios.
SOLO LECTURA: NO puedes reservar, confirmar ni apartar citas con esta herramienta.
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
          const slots = await getAvailableSlots(day);
          return {
            days: [{
              name: d.name,
              slots: slots.map((s) => ({ time: s.time, type: s.type || "general" })),
            }],
          };
        }
        const days = await getWeekDays();
        const result = [];
        for (const d of days) {
          const slots = await getAvailableSlots(d.name);
          result.push({
            name: d.name,
            slots: slots.map((s) => ({ time: s.time, type: s.type || "general" })),
          });
        }
        return { days: result };
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

  // ─── New tools (always available) ─────────────────────

  const newTools: Record<string, Tool> = {

    createAppointment: tool({
      description: `RESERVA UNA CITA. OBLIGATORIO: llama esta tool cuando el usuario pida agendar explícitamente.
NO respondas sin ejecutar esta tool. NO digas "escribe Quiero agendar". NO derives a WhatsApp.
INPUT: day (nombre del día en español), time (hora exacta), type (tipo de cita).
Antes de crear, verifica disponibilidad con getAgenda.`,
      inputSchema: z.object({
        day: z.string().describe("Nombre del día en español (ej: Lunes, Martes)"),
        time: z.string().describe("Hora exacta (ej: 09:00, 10:00)"),
        type: z.string().describe("Tipo de cita (ej: Consulta general, Primera visita)"),
      }),
      execute: async ({ day, time, type }) => {
        const appt = await createAppointment(day, time, type, context.customerName || "Cliente", context.phone);
        if (!appt) return { success: false, message: `El slot ${day} ${time} ya no está disponible.` };
        const { notifyAdmin } = await import("@/lib/external/whatsapp/send");
        notifyAdmin(`Nueva cita: ${day} ${time} (${type}) - ${context.customerName || "Cliente"} - tel: ${context.phone}`);
        return { success: true, message: `Cita confirmada: ${day} ${time} (${type}).`, appointment: appt };
      },
    }),

    getMyAppointments: tool({
      description: "Obtiene las citas agendadas por el usuario actual.",
      inputSchema: z.object({}),
      execute: async () => {
        const apps = await getMyAppointments(context.phone);
        return { appointments: apps };
      },
    }),

    createReview: tool({
      description: `CREA UNA RESEÑA. OBLIGATORIO: llama esta tool cuando el usuario quiera dejar una reseña.
La reseña queda pendiente de moderación del administrador.
INPUT: productSlug (slug del producto), comment (texto de la reseña), rating (SOLO EL NÚMERO: 1 al 5).
EXTRACCIÓN DE RATING: el usuario dirá algo como "5 estrellas" o "4 de 5". Convierte eso a un número. rating DEBE ser 1, 2, 3, 4 o 5. NUNCA 0.
NO preguntes el nombre. Usa el nombre del cliente de WhatsApp, o "Anónimo" si no está disponible.`,
      inputSchema: z.object({
        productSlug: z.string().describe("Slug del producto"),
        comment: z.string().describe("Comentario de la reseña"),
        rating: z.number().min(1).max(5).describe("Calificación del 1 al 5"),
      }),
      execute: async ({ productSlug, comment, rating }) => {
        const name = context.customerName || "Anónimo";
        const validRating = Math.max(1, Math.min(5, Math.round(Number(rating))));
        const review = await createRedisReview(productSlug, { name, comment, rating: validRating }, context.phone);
        if (!review) return { success: false, message: "No se pudo crear la reseña." };
        return { success: true, message: `Reseña creada (${validRating}★). Queda pendiente de revisión.`, review };
      },
    }),

    getMyReviews: tool({
      description: "Obtiene las reseñas creadas por el usuario actual.",
      inputSchema: z.object({}),
      execute: async () => {
        const reviews = await getMyReviews(context.phone);
        return { reviews };
      },
    }),

    setReviewVisibility: tool({
      description: "Cambia la visibilidad de una reseña propia a public o private.",
      inputSchema: z.object({
        id: z.string().describe("ID de la reseña"),
        visibility: z.enum(["public", "private"]).describe("public o private"),
      }),
      execute: async ({ id, visibility }) => {
        const ok = await setReviewVisibility(id, visibility);
        return { success: ok, message: ok ? `Visibilidad cambiada a ${visibility}.` : "No se pudo cambiar." };
      },
    }),

    createComment: tool({
      description: `Crea un comentario en un artículo del blog. Queda pendiente de moderación.
INPUT: postSlug (slug del artículo), name (tu nombre), comment (tu comentario).`,
      inputSchema: z.object({
        postSlug: z.string().describe("Slug del artículo del blog"),
        name: z.string().describe("Nombre del usuario"),
        comment: z.string().describe("Contenido del comentario"),
      }),
      execute: async ({ postSlug, name, comment }) => {
        const c = await createRedisComment(postSlug, { name, comment }, context.phone);
        if (!c) return { success: false, message: "No se pudo crear el comentario." };
        return { success: true, message: "Comentario creado. Queda pendiente de revisión.", comment: c };
      },
    }),

    getMyComments: tool({
      description: "Obtiene los comentarios creados por el usuario actual.",
      inputSchema: z.object({}),
      execute: async () => {
        const comments = await getMyComments(context.phone);
        return { comments };
      },
    }),

    setCommentVisibility: tool({
      description: "Cambia la visibilidad de un comentario propio a public o private.",
      inputSchema: z.object({
        id: z.string().describe("ID del comentario"),
        visibility: z.enum(["public", "private"]).describe("public o private"),
      }),
      execute: async ({ id, visibility }) => {
        const ok = await setCommentVisibility(id, visibility);
        return { success: ok, message: ok ? `Visibilidad cambiada a ${visibility}.` : "No se pudo cambiar." };
      },
    }),

    createOrder: tool({
      description: `SOLO LLAMANDO ESTA TOOL SE CREA UN PEDIDO REAL. Sin esta tool los pedidos NO EXISTEN en el sistema, NO hay registro de venta, NO hay seguimiento de entrega.
OBLIGATORIO: llama esta tool CUANDO el usuario quiera comprar productos. 
INPUT: items, total, email, idNumber, fullName, deliveryAddress. Todos obligatorios.
SI FALTA ALGÚN DATO, pídelo al usuario. No simules la creación.
ADVERTENCIA: Si no llamas esta tool, el pedido NO queda registrado en la base de datos.`,
      inputSchema: z.object({
        items: z.string().describe("Descripción de los productos solicitados"),
        total: z.string().describe("Monto total del pedido"),
        email: z.string().describe("Correo electrónico del cliente"),
        idNumber: z.string().describe("Número de cédula, RUC o NUI"),
        fullName: z.string().describe("Nombres y apellidos completos"),
        deliveryAddress: z.string().describe("Dirección de entrega"),
      }),
      execute: async ({ items, total, email, idNumber, fullName, deliveryAddress }) => {
        const order = await createBusOrder({ items, total, email, idNumber, fullName, deliveryAddress, phone: context.phone });
        if (!order) return { success: false, message: "No se pudo crear el pedido." };
        const { notifyAdmin } = await import("@/lib/external/whatsapp/send");
        notifyAdmin(`Nuevo pedido #${order.id}: ${items} - $${total} - ${fullName} - tel: ${context.phone}`);
        return { success: true, message: `Pedido #${order.id} creado. Pendiente de pago. Comparte tu ubicación para la entrega.`, order };
      },
    }),

    getMyOrders: tool({
      description: "Obtiene los pedidos realizados por el usuario actual.",
      inputSchema: z.object({}),
      execute: async () => {
        const orders = await getMyOrders(context.phone);
        return { orders };
      },
    }),

    shareDeliveryGps: tool({
      description: "Guarda la ubicación GPS de entrega para un pedido. El usuario debe compartir su ubicación.",
      inputSchema: z.object({
        orderId: z.string().describe("ID del pedido"),
        lat: z.string().describe("Latitud"),
        lng: z.string().describe("Longitud"),
      }),
      execute: async ({ orderId, lat, lng }) => {
        const ok = await setOrderDeliveryGps(orderId, lat, lng);
        return { success: ok, message: ok ? "Ubicación guardada para la entrega." : "No se pudo guardar." };
      },
    }),

    getOrderDetail: tool({
      description: "Obtiene el detalle de un pedido específico (solo del mismo usuario o admin).",
      inputSchema: z.object({ id: z.string().describe("ID del pedido") }),
      execute: async ({ id }) => {
        const order = await getOrderDetail(id);
        if (!order) return { found: false, message: "Pedido no encontrado." };
        if (order.phone !== context.phone && !context.isAdmin) return { found: false, message: "No tienes acceso a este pedido." };
        return { found: true, order };
      },
    }),
  };

  // ─── Admin-only tools ──────────────────────────────────

  if (context.isAdmin) {
    const adminTools: Record<string, Tool> = {

      updateStock: tool({
        description: "Actualiza el stock de un producto por variante. Solo administrador.",
        inputSchema: z.object({
          slug: z.string().describe("Slug del producto"),
          variantId: z.string().describe("ID de la variante (ej: 1kg-chocolate)"),
          quantity: z.number().min(0).describe("Nueva cantidad en stock"),
        }),
        execute: async ({ slug, variantId, quantity }) => {
          const { isRedisConfigured, hashSet } = await import("@/lib/external/upstash/redis");
          if (!isRedisConfigured()) return { success: false, message: "Redis no configurado." };
          await hashSet(`bus:stock:${slug}`, variantId, String(quantity));
          return { success: true, message: `Stock de ${slug} / ${variantId} actualizado a ${quantity}.` };
        },
      }),

      getPendingReviews: tool({
        description: "Obtiene todas las reseñas pendientes de moderación. Solo administrador.",
        inputSchema: z.object({}),
        execute: async () => {
          const reviews = await getPendingReviews();
          return { pendingReviews: reviews };
        },
      }),

      approveReview: tool({
        description: "Aprueba una reseña pendiente para que sea visible públicamente.",
        inputSchema: z.object({ id: z.string().describe("ID de la reseña") }),
        execute: async ({ id }) => {
          const ok = await approveReview(id);
          return { success: ok, message: ok ? "Reseña aprobada." : "No se pudo aprobar." };
        },
      }),

      rejectReview: tool({
        description: "Rechaza una reseña pendiente. Se elimina de la cola.",
        inputSchema: z.object({ id: z.string().describe("ID de la reseña") }),
        execute: async ({ id }) => {
          const ok = await rejectReview(id);
          return { success: ok, message: ok ? "Reseña rechazada." : "No se pudo rechazar." };
        },
      }),

      getPendingComments: tool({
        description: "Obtiene todos los comentarios pendientes de moderación. Solo administrador.",
        inputSchema: z.object({}),
        execute: async () => {
          const comments = await getPendingComments();
          return { pendingComments: comments };
        },
      }),

      approveComment: tool({
        description: "Aprueba un comentario pendiente para que sea visible.",
        inputSchema: z.object({ id: z.string().describe("ID del comentario") }),
        execute: async ({ id }) => {
          const ok = await approveComment(id);
          return { success: ok, message: ok ? "Comentario aprobado." : "No se pudo aprobar." };
        },
      }),

      rejectComment: tool({
        description: "Rechaza un comentario pendiente.",
        inputSchema: z.object({ id: z.string().describe("ID del comentario") }),
        execute: async ({ id }) => {
          const ok = await rejectComment(id);
          return { success: ok, message: ok ? "Comentario rechazado." : "No se pudo rechazar." };
        },
      }),

      getAllAppointments: tool({
        description: "Obtiene todas las citas agendadas. Solo administrador.",
        inputSchema: z.object({}),
        execute: async () => {
          const apps = await getAllAppointments();
          return { appointments: apps };
        },
      }),

      getAppointmentDetail: tool({
        description: "Obtiene el detalle completo de una cita por su ID.",
        inputSchema: z.object({ id: z.string().describe("ID de la cita") }),
        execute: async ({ id }) => {
          const appt = await getAppointmentDetail(id);
          return appt ? { found: true, appointment: appt } : { found: false, message: "Cita no encontrada." };
        },
      }),

      updateApptStatus: tool({
        description: "Actualiza el estado de una cita: confirmed, cancelled, completed, noshow.",
        inputSchema: z.object({
          id: z.string().describe("ID de la cita"),
          status: z.enum(["confirmed", "cancelled", "completed", "noshow"]).describe("Nuevo estado"),
        }),
        execute: async ({ id, status }) => {
          const ok = await updateApptStatus(id, status);
          return { success: ok, message: ok ? `Cita actualizada a ${status}.` : "No se pudo actualizar." };
        },
      }),

      getAllOrders: tool({
        description: "Obtiene todos los pedidos del sistema. Solo administrador.",
        inputSchema: z.object({}),
        execute: async () => {
          const orders = await getAllOrders();
          return { orders };
        },
      }),

      updateOrderStatus: tool({
        description: `Actualiza el estado de un pedido. Solo administrador.
Estados: paid (pagado, descuenta stock), shipping (en envío), delivered (entregado), cancelled (cancelado).
Usar paid solo después de verificar el comprobante de pago (human-in-the-loop).`,
        inputSchema: z.object({
          id: z.string().describe("ID del pedido"),
          status: z.enum(["paid", "shipping", "delivered", "cancelled"]).describe("Nuevo estado"),
        }),
        execute: async ({ id, status }) => {
          const ok = await updateOrderStatus(id, status);
          return { success: ok, message: ok ? `Pedido #${id} actualizado a ${status}.` : "No se pudo actualizar." };
        },
      }),

      verifyPayment: tool({
        description: `Human-in-the-loop: confirma o rechaza el pago de un pedido.
Solo el administrador. confirmed=true marca como paid, false marca como rejected.`,
        inputSchema: z.object({
          id: z.string().describe("ID del pedido"),
          confirmed: z.boolean().describe("true si el pago llegó, false si no"),
        }),
        execute: async ({ id, confirmed }) => {
          const status = confirmed ? "paid" : "rejected";
          const ok = await updateOrderStatus(id, status);
          if (ok) {
            const { notifyCustomer } = await import("@/lib/external/whatsapp/send");
            const { getOrderDetail } = await import("@/lib/modules/orders");
            const order = await getOrderDetail(id);
            const msg = confirmed
              ? `✅ Tu pedido #${id} ha sido CONFIRMADO y está en proceso. Gracias por tu compra.`
              : `❌ Tu pedido #${id} ha sido RECHAZADO. El pago no pudo ser verificado.`;
            if (order?.phone) notifyCustomer(order.phone, msg);
          }
          return { success: ok, message: ok ? `Pedido #${id}: ${status}.` : "No se pudo procesar." };
        },
      }),
    };

    Object.assign(newTools, adminTools);
  }

  Object.assign(tools, newTools);
  return tools;
}
