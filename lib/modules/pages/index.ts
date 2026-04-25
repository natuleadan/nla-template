import { cacheLife, cacheTag } from "next/cache"

export interface PageContent {
  title: string
  description: string
  content: Array<{ type: string; [key: string]: unknown }>
}

const pages = new Map<string, PageContent>([
  ["contacto", {
    title: "Contacto",
    description: "¿Tienes alguna pregunta? Contáctanos.",
    content: [
      { type: "header", title: "Encuéntranos" },
      { type: "info", icon: "map", label: "Dirección", value: "Calle Principal 123" },
      { type: "info", icon: "phone", label: "Teléfono", value: "+1 (234) 567-890" },
      { type: "info", icon: "mail", label: "Email", value: "contacto@ejemplo.com" },
      { type: "header", title: "Escríbenos" },
      { type: "form" },
    ],
  }],
  ["terminos", {
    title: "Términos y Condiciones",
    description: "Última actualización: 2026 - Términos y condiciones de uso conforme a la legislación ecuatoriana.",
    content: [
      { type: "paragraph", text: "Última actualización: 2026" },
      { type: "header", title: "1. Objeto" },
      { type: "paragraph", text: "Los presentes Términos y Condiciones regulan la relación entre el prestador del servicio y los usuarios." },
      { type: "header", title: "2. Identificación" },
      { type: "paragraph", text: "Acme Inc, sociedad constituida bajo las leyes del Ecuador." },
      { type: "header", title: "3. Capacidad Legal" },
      { type: "paragraph", text: "El usuario declara ser mayor de 18 años conforme al Código Civil ecuatoriano." },
      { type: "header", title: "4. Precio y Forma de Pago" },
      { type: "paragraph", text: "Los precios se expresan en USD. El pago mediante transferencia bancaria o métodos electrónicos autorizados en Ecuador conforme al SRI." },
      { type: "header", title: "5. Derechos del Consumidor" },
      { type: "paragraph", text: "Conforme a la Ley Orgánica de Protección al Consumidor (LOPC): información veraz, protección contra publicidad engañosa, trato digno, garantía legal." },
      { type: "header", title: "6. Garantías" },
      { type: "paragraph", text: "Período de garantía de 30 días. No aplica por uso indebido o negligencia." },
      { type: "header", title: "7. Protección de Datos" },
      { type: "paragraph", text: "Conforme a la Ley Orgánica de Protección de Datos Personales (LOPDP). Datos no serán cedidos sin consentimiento." },
      { type: "header", title: "8. Legislación Aplicable" },
      { type: "paragraph", text: "Se rige por las leyes del Ecuador: Código Civil, Ley de Comercio Electrónico, LOPC, LOPDP." },
      { type: "header", title: "9. Jurisdicción" },
      { type: "paragraph", text: "Las partes se someten a los judges competentes de Quito, Ecuador." },
    ],
  }],
  ["privacidad", {
    title: "Política de Privacidad",
    description: "Última actualización: 2026 - Política de privacidad conforme a la legislación ecuatoriana.",
    content: [
      { type: "paragraph", text: "Última actualización: 2026" },
      { type: "header", title: "1. Responsable" },
      { type: "paragraph", text: "Acme Inc es el responsable del tratamiento de datos personales." },
      { type: "header", title: "2. Marco Legal" },
      { type: "paragraph", text: "Ley Orgánica de Protección de Datos Personales (LOPDP) del Ecuador." },
      { type: "header", title: "3. Datos Recopilados" },
      { type: "paragraph", text: "Nombres, Cédula/RUC, correo, teléfono, dirección de entrega, datos de pago." },
      { type: "header", title: "4. Finalidad" },
      { type: "paragraph", text: "Gestión de pedidos, facturación (SRI), entrega, atención al cliente, comunicaciones comerciales." },
      { type: "header", title: "5. Base Legal" },
      { type: "paragraph", text: "Ejecución del contrato, cumplimiento legal, y consentimiento del titular." },
      { type: "header", title: "6. Destinatarios" },
      { type: "paragraph", text: "Empresas de mensajería, entidades financieras, autoridades competentes, proveedores tecnológicos." },
      { type: "header", title: "7. Transferencias" },
      { type: "paragraph", text: "No se transfieren datos fuera del Ecuador sin consentimiento." },
      { type: "header", title: "8. Conservación" },
      { type: "paragraph", text: "Datos de facturación se conservan 7 años conforme a normativa tributaria." },
      { type: "header", title: "9. Derechos" },
      { type: "paragraph", text: "Acceso, rectificación, supresión, portabilidad, limitación. Contacto: contacto@ejemplo.com" },
      { type: "header", title: "10. Seguridad" },
      { type: "paragraph", text: "Cifrado SSL, controles de acceso, copias de seguridad, formación del personal." },
    ],
  }],
  ["datos", {
    title: "Tratamiento de Datos Personales",
    description: "Última actualización: 2026 - Información sobre tratamiento de datos personales conforme a LOPDP.",
    content: [
      { type: "paragraph", text: "Última actualización: 2026" },
      { type: "header", title: "1. Responsable" },
      { type: "paragraph", text: "Acme Inc, empresa constituida en Ecuador." },
      { type: "header", title: "2. Normativa" },
      { type: "paragraph", text: "LOPDP, Reglamento LOPDP, Ley de Comercio Electrónico." },
      { type: "header", title: "3. Finalidades" },
      { type: "paragraph", text: "Gestión de pedidos, facturación electrónica, entrega, atención, cumplimiento tributario." },
      { type: "header", title: "4. Categorías de Datos" },
      { type: "paragraph", text: "Identificación (nombres, cédula/RUC), contacto (teléfono, email, dirección), transacciones, pago." },
      { type: "header", title: "5. Legitimación" },
      { type: "paragraph", text: "Ejecución contractual, obligaciones legales, interés legítimo." },
      { type: "header", title: "6. Destinatarios" },
      { type: "paragraph", text: "Servicios de mensajería, bancos, autoridades públicas (SRI), proveedores tecnológicos." },
      { type: "header", title: "7. Plazos" },
      { type: "paragraph", text: "Clientes: relación comercial + 7 años. Facturación: 7 años. Marketing: hasta supresión." },
      { type: "header", title: "8. Ejercicio de Derechos" },
      { type: "paragraph", text: "Solicitud escrita a contacto@ejemplo.com. Respuesta en 15 días hábiles." },
      { type: "header", title: "9. Seguridad" },
      { type: "paragraph", text: "SSL/TLS, 2FA, acceso restringido, auditorías periódicas." },
      { type: "header", title: "10. Autoridad de Control" },
      { type: "paragraph", text: "Reclamaciones ante Autoridad de Protección de Datos: www.datos.gob.ec" },
    ],
  }],
])

const DANGEROUS_PROPS = new Set(["__proto__", "constructor", "prototype"])

function isValidPageName(name: string): boolean {
  return !DANGEROUS_PROPS.has(name) && typeof name === "string" && name.length > 0 && name.length <= 50
}

export async function getPageContent(pageName: string): Promise<PageContent | undefined> {
  'use cache'
  cacheLife('days')
  cacheTag('pages', pageName)
  if (!isValidPageName(pageName)) return undefined
  return pages.get(pageName)
}

export function getAllPages(): Record<string, PageContent> {
  return Object.fromEntries(pages)
}

export function createPage(pageName: string, content: Omit<PageContent, "description">): PageContent {
  if (!isValidPageName(pageName)) {
    throw new Error("Invalid page name")
  }
  const newPage: PageContent = {
    ...content,
    description: content.description || "Página creada",
  }
  pages.set(pageName, newPage)
  return newPage
}

export function updatePages(data: Partial<PageContent>[]): Record<string, PageContent> {
  return Object.fromEntries(pages)
}

export function deletePages(): void {
  pages.clear()
}
