export interface OpenApiSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: Record<string, unknown>;
  $ref?: string;
  enum?: string[];
  minimum?: number;
  maximum?: number;
  example?: unknown;
}

export interface OpenApiParameter {
  name: string;
  in: "path" | "query" | "header";
  required?: boolean;
  schema: { type: string };
  example?: string;
  description?: string;
}

export interface OpenApiResponse {
  description: string;
  content?: Record<string, unknown>;
}

export interface OpenApiOperation {
  tags: string[];
  summary: string;
  description?: string;
  security?: Record<string, unknown>[];
  parameters?: OpenApiParameter[];
  requestBody?: Record<string, unknown>;
  responses: Record<string, OpenApiResponse>;
}

export interface OpenApiPath {
  get?: OpenApiOperation;
  post?: OpenApiOperation;
  put?: OpenApiOperation;
  delete?: OpenApiOperation;
}

export interface OpenApiSpec {
  openapi: string;
  info: {
    title: string;
    description: string;
    version: string;
    contact?: { name: string; email: string };
    license?: { name: string; url: string };
  };
  servers: Array<{ url: string; description?: string }>;
  security: Record<string, unknown>[];
  components: {
    securitySchemes: Record<string, unknown>;
    schemas: Record<string, OpenApiSchema>;
  };
  tags: Array<{ name: string; description: string }>;
  paths: Record<string, OpenApiPath>;
}

export interface ApiExamples {
  products: unknown[];
  categories: unknown[];
  reviews: unknown[];
  inventory: unknown;
  messages: unknown[];
  orders: unknown[];
  page: unknown;
  posts: unknown[];
  days: unknown[];
}
