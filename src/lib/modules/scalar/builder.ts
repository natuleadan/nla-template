import type { OpenApiSpec, ApiExamples } from "./types";
import { schemas, tags, securitySchemes } from "./schemas";
import { getBaseUrl } from "@/lib/env";
import {
  getProductsPaths,
  getCategoriesPaths,
  getReviewsPaths,
  getBlogPaths,
  getAgendaPaths,
  getPaginasPaths,
  getWhatsappPaths, getChatPaths,
} from "./endpoints";

export function buildOpenApiSpec(examples: ApiExamples): OpenApiSpec {
  const productsPaths = getProductsPaths(examples);
  const categoriesPaths = getCategoriesPaths(examples);
  const reviewsPaths = getReviewsPaths(examples);
  const blogPaths = getBlogPaths(examples);
  const agendaPaths = getAgendaPaths();
  const paginasPaths = getPaginasPaths(examples);
  const whatsappPaths = getWhatsappPaths();
  const chatPaths = getChatPaths();

  return {
    openapi: "3.1.0",
    info: {
      title: "ACME Store API",
      version: "1.0.0",
      description:
        "API pública de la tienda. Endpoints de solo lectura con datos estáticos. Chat y webhooks protegidos por API key y HMAC respectivamente.",
      contact: {
        name: "Soporte ACME",
        email: "soporte@ejemplo.com",
      },
      license: {
        name: "MIT",
        url: "https://opensource.org/licenses/MIT",
      },
    },
    servers: [
      {
        url: getBaseUrl(),
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes,
      schemas,
    },
    tags,
    paths: {
      ...productsPaths,
      ...reviewsPaths,
      ...categoriesPaths,
      ...blogPaths,
      ...agendaPaths,
      ...paginasPaths,
      ...chatPaths,
      ...whatsappPaths,
    },
  };
}
