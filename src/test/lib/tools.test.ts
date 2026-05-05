import { describe, it, expect } from "vitest";
import { getAllProducts, getProduct } from "@/lib/modules/products";
import { getReviews } from "@/lib/modules/reviews";
import { getAllPaginas, getPagina } from "@/lib/modules/paginas";
import { getAllPosts, getPost } from "@/lib/modules/blog";
import { getWeekDays, getDayByName } from "@/lib/modules/agenda";
describe("tools - products", () => {
  it("getAllProducts should return catalog", async () => {
    const products = await getAllProducts();
    expect(Array.isArray(products)).toBe(true);
    if (products.length > 0) {
      expect(products[0]).toHaveProperty("name");
      expect(products[0]).toHaveProperty("price");
      expect(products[0]).toHaveProperty("slug");
      expect(products[0]).toHaveProperty("category");
    }
  });

  it("getProduct should find by slug", async () => {
    const products = await getAllProducts();
    if (products.length > 0) {
      const slug = products[0].slug;
      const p = await getProduct(slug);
      expect(p).not.toBeNull();
      expect(p!.name).toBe(products[0].name);
    }
  });

  it("getProduct should return null for unknown slug", async () => {
    const p = await getProduct("non-existent-slug-xyz");
    expect(p).toBeNull();
  });

  it("products should have unique categories", async () => {
    const products = await getAllProducts();
    const cats = [...new Set(products.map((p) => p.category))];
    expect(cats.length).toBeGreaterThan(0);
    cats.forEach((c) => expect(typeof c).toBe("string"));
  });
});

describe("tools - reviews", () => {
  it("getReviews should return array", async () => {
    const reviews = await getReviews("some-slug");
    expect(Array.isArray(reviews)).toBe(true);
  });

  it("reviews should have required fields", async () => {
    const products = await getAllProducts();
    for (const p of products) {
      const reviews = await getReviews(p.slug);
      for (const r of reviews) {
        expect(r).toHaveProperty("productSlug");
        expect(r).toHaveProperty("rating");
        expect(r).toHaveProperty("status");
      }
    }
  });
});

describe("tools - pages", () => {
  it("getAllPaginas should return pages", async () => {
    const pages = await getAllPaginas();
    expect(Array.isArray(pages)).toBe(true);
    if (pages.length > 0) {
      expect(pages[0]).toHaveProperty("title");
      expect(pages[0]).toHaveProperty("category");
    }
  });

  it("getPagina should find by slug", async () => {
    const pages = await getAllPaginas();
    if (pages.length > 0) {
      const p = await getPagina(pages[0].slug);
      expect(p).not.toBeNull();
    }
  });

  it("pages should have categories", async () => {
    const pages = await getAllPaginas();
    const cats = [...new Set(pages.map((p) => p.category))];
    expect(cats.length).toBeGreaterThan(0);
  });
});

describe("tools - blog", () => {
  it("getAllPosts should return posts", async () => {
    const posts = await getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    if (posts.length > 0) {
      expect(posts[0]).toHaveProperty("title");
      expect(posts[0]).toHaveProperty("category");
      expect(posts[0]).toHaveProperty("author");
    }
  });

  it("getPost should find by slug", async () => {
    const posts = await getAllPosts();
    if (posts.length > 0) {
      const p = await getPost(posts[0].slug);
      expect(p).not.toBeNull();
    }
  });

  it("posts should have categories", async () => {
    const posts = await getAllPosts();
    const cats = [...new Set(posts.map((p) => p.category))];
    expect(cats.length).toBeGreaterThan(0);
  });
});

describe("tools - agenda", () => {
  it("getWeekDays should return days", async () => {
    const days = await getWeekDays();
    expect(Array.isArray(days)).toBe(true);
    if (days.length > 0) {
      expect(days[0]).toHaveProperty("name");
      expect(days[0]).toHaveProperty("slots");
    }
  });

  it("getDayByName should find day", async () => {
    const days = await getWeekDays();
    if (days.length > 0) {
      const d = await getDayByName(days[0].name);
      expect(d).not.toBeNull();
      expect(d!.name).toBe(days[0].name);
    }
  });

  it("getDayByName should return null for invalid day", async () => {
    const d = await getDayByName("FakeDayX");
    expect(d).toBeNull();
  });
});
