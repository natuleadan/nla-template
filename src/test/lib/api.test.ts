import { describe, it, expect, vi, beforeEach } from "vitest";
import { getBaseUrl } from "@/lib/env";

const mockFetch = vi.fn();
vi.stubGlobal("fetch", mockFetch);

const BASE_URL = getBaseUrl();

describe("API Products", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("GET /api/v1/products returns product list", async () => {
    const mockProducts = [
      {
        id: "001",
        slug: "proteina-whey",
        name: "Proteína Whey",
        price: 29.99,
        category: "suplemento",
      },
    ];
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: mockProducts, total: 1, hasMore: false }),
    });
    const res = await fetch(`${BASE_URL}/api/v1/products`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.products.length).toBe(1);
    expect(data.products[0]).toHaveProperty("slug");
  });

  it("GET /api/v1/products/[slug] returns single product", async () => {
    const mockProduct = {
      id: "001",
      slug: "proteina-whey",
      name: "Proteína Whey",
      price: 29.99,
      category: "suplemento",
      reviews: [],
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockProduct });
    const res = await fetch(`${BASE_URL}/api/v1/products/proteina-whey`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.slug).toBe("proteina-whey");
    expect(data).toHaveProperty("reviews");
  });

  it("GET /api/v1/products/[slug] returns 404", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const res = await fetch(`${BASE_URL}/api/v1/products/non-existent`);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
  });
});

describe("API Resenas", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("GET /api/v1/resenas/[productSlug] returns reviews", async () => {
    const mockReviews = [
      {
        id: "001",
        name: "Carlos",
        comment: "Excelente",
        rating: 5,
        createdAt: "2026-04-25T10:00:00Z",
      },
    ];
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockReviews });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("API Categorías", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("GET /api/v1/categories returns category list", async () => {
    const mockCategories = [
      { id: "cat_1", name: "Categoría 1", slug: "cat-1" },
    ];
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockCategories });
    const res = await fetch(`${BASE_URL}/api/v1/categories`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(Array.isArray(data)).toBe(true);
  });
});

describe("API Paginas", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("GET /api/v1/paginas returns pages", async () => {
    const mockPages = {
      pages: [{ id: "001", slug: "terminos", title: "Términos" }],
      total: 1,
      hasMore: false,
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockPages });
    const res = await fetch(`${BASE_URL}/api/v1/paginas`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.pages.length).toBe(1);
  });

  it("GET /api/v1/paginas/[slug] returns page detail", async () => {
    const mockPage = {
      id: "001",
      slug: "terminos",
      title: "Términos",
      content: "<p>Contenido</p>",
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockPage });
    const res = await fetch(`${BASE_URL}/api/v1/paginas/terminos`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.title).toBe("Términos");
  });
});

describe("API Blog", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("GET /api/v1/blog returns posts", async () => {
    const mockPosts = {
      posts: [{ id: "001", slug: "test-post", title: "Test" }],
      total: 1,
      hasMore: false,
    };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockPosts });
    const res = await fetch(`${BASE_URL}/api/v1/blog`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.posts.length).toBe(1);
  });
});
