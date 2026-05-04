import type { MetadataRoute } from "next";

export interface RouteConfig {
  path: string;
  module: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"];
}

export const staticRoutes: RouteConfig[] = [
  { path: "", module: "home", priority: 1, changeFreq: "daily" },
  { path: "/store", module: "products", priority: 0.9, changeFreq: "daily" },
  { path: "/news", module: "posts", priority: 0.9, changeFreq: "daily" },
  { path: "/schedule", module: "agenda", priority: 0.6, changeFreq: "weekly" },
  { path: "/contact", module: "contact", priority: 0.5, changeFreq: "monthly" },
  { path: "/certificates", module: "certificates", priority: 0.4, changeFreq: "monthly" },
];

export interface EntityRouteConfig {
  prefix: string;
  priority: number;
  changeFreq: MetadataRoute.Sitemap[number]["changeFrequency"];
}

export const entityRoutes: EntityRouteConfig[] = [
  { prefix: "/store/", priority: 0.8, changeFreq: "weekly" },
  { prefix: "/news/", priority: 0.6, changeFreq: "monthly" },
  { prefix: "/pages/", priority: 0.4, changeFreq: "monthly" },
];
