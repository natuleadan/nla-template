import type { OpenApiSpec, ApiExamples } from "./types";
import { schemas, tags, securitySchemes } from "./schemas";
import { getBaseUrl } from "@/lib/env";
import {
  getProductsPaths,
  getCategoriesPaths,
  getReviewsPaths,
  getInventoryPaths,
  getOrdersPaths,
  getPagesPaths,
  getFormPaths,
  getBlogPaths,
  getAgendaPaths,
  getPaginasPaths,
} from "./endpoints";

export function buildOpenApiSpec(examples: ApiExamples): OpenApiSpec {
  const productsPaths = getProductsPaths(examples);
  const categoriesPaths = getCategoriesPaths(examples);
  const reviewsPaths = getReviewsPaths(examples);
  const inventoryPaths = getInventoryPaths(examples);
  const ordersPaths = getOrdersPaths(examples);
  const pagesPaths = getPagesPaths(examples);
  const formularioPaths = getFormPaths(examples);
  const blogPaths = getBlogPaths(examples);
  const agendaPaths = getAgendaPaths(examples);
  const paginasPaths = getPaginasPaths(examples);

  return {
    openapi: "3.1.0",
    info: {
      title: "GymFood API",
      description:
        "API para la tienda de suplementos y alimentos fitness. Todos los endpoints protegidos requieren `x-api-key` en el header.",
      version: "1.0.0",
      contact: {
        name: "Soporte GymFood",
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
    security: [{ ApiKeyAuth: [] }],
    components: {
      securitySchemes,
      schemas,
    },
    tags,
    paths: {
      ...productsPaths,
      ...reviewsPaths,
      ...inventoryPaths,
      ...ordersPaths,
      ...categoriesPaths,
      ...pagesPaths,
      ...formularioPaths,
      ...blogPaths,
      ...agendaPaths,
      ...paginasPaths,
    },
  };
}
