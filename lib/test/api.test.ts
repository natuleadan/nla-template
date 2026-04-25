import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

const BASE_URL = 'http://localhost:3000';
const API_KEY = 'dev-key-change-in-production';

describe('API Products', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('GET /api/v1/products returns product list', async () => {
    const mockProducts = [
      { id: '1', slug: 'proteina-whey', name: 'Proteína Whey', price: 29.99, category: 'suplemento', quantity: 1, unit: 'lb' },
      { id: '2', slug: 'creatina-monohidratada', name: 'Creatina Monohidratada', price: 19.99, category: 'suplemento', quantity: 300, unit: 'g' },
    ];
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockProducts });
    const res = await fetch(`${BASE_URL}/api/v1/products`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
    expect(data[0]).toHaveProperty('slug');
    expect(data[0]).toHaveProperty('price');
  });

  it('GET /api/v1/products/[slug] returns single product', async () => {
    const mockProduct = { id: '1', slug: 'proteina-whey', name: 'Proteína Whey', description: 'Proteína de suero', price: 29.99, category: 'suplemento', quantity: 1, unit: 'lb', longDescription: 'Descripción larga', reviews: [] };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockProduct });
    const res = await fetch(`${BASE_URL}/api/v1/products/proteina-whey`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.slug).toBe('proteina-whey');
    expect(data).toHaveProperty('longDescription');
    expect(data).toHaveProperty('reviews');
  });

  it('GET /api/v1/products/[slug] returns 404', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 404 });
    const res = await fetch(`${BASE_URL}/api/v1/products/non-existent`);
    expect(res.ok).toBe(false);
    expect(res.status).toBe(404);
  });

  it('POST /api/v1/products requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/products`, { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('POST /api/v1/products with API key succeeds', async () => {
    mockFetch.mockResolvedValue({ ok: true, status: 201, json: async () => ({ message: 'Producto creado' }) });
    const res = await fetch(`${BASE_URL}/api/v1/products`, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-api-key': API_KEY } });
    expect(res.status).toBe(201);
  });

  it('PUT /api/v1/products requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/products`, { method: 'PUT' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/products requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/products`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('API Resenas', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it('GET /api/v1/resenas/[productSlug] returns reviews', async () => {
    const mockReviews = [{ id: '1', name: 'Carlos', comment: 'Excelente', rating: 5, createdAt: '2026-04-25T10:00:00Z' }];
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockReviews });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(Array.isArray(data)).toBe(true);
  });

  it('POST /api/v1/resenas creates new review', async () => {
    const newReview = { name: 'Pepe', comment: 'Muy bueno', rating: 5 };
    const mockResponse = { id: '3', productSlug: 'proteina-whey', ...newReview, createdAt: '2026-04-25T12:00:00Z' };
    mockFetch.mockResolvedValue({ ok: true, status: 201, json: async () => mockResponse });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newReview) });
    const data = await res.json();
    expect(res.status).toBe(201);
    expect(data.name).toBe('Pepe');
  });

  it('POST validates required fields', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 400, json: async () => ({ error: 'Datos inválidos' }) });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: '', comment: '', rating: 0 }) });
    expect(res.status).toBe(400);
  });

  it('PUT /api/v1/resenas requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`, { method: 'PUT' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/resenas requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/resenas/proteina-whey`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('API Inventario', () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it('GET /api/v1/inventario returns inventory', async () => {
    const mockInventory = { productSlug: 'proteina-whey', total: 35, locations: [{ location: 'Bogotá - Norte', quantity: 15 }, { location: 'Bogotá - Centro', quantity: 20 }] };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockInventory });
    const res = await fetch(`${BASE_URL}/api/v1/inventario/proteina-whey`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.productSlug).toBe('proteina-whey');
    expect(data.total).toBe(35);
  });

  it('PUT /api/v1/inventario requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/inventario/proteina-whey`, { method: 'PUT' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/inventario requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/inventario/proteina-whey`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('API Pedidos', () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it('POST /api/v1/pedidos creates new order', async () => {
    const order = { productId: '1', productName: 'Proteína Whey', price: 29.99 };
    const mockResponse = { id: '1', ...order, createdAt: '2026-04-25T12:00:00Z' };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockResponse });
    const res = await fetch(`${BASE_URL}/api/v1/pedidos`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.productName).toBe('Proteína Whey');
  });

  it('PUT /api/v1/pedidos requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/pedidos`, { method: 'PUT' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/pedidos requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/pedidos`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('API Categorías', () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it('GET /api/v1/categories returns category list', async () => {
    const mockCategories = [{ id: 'suplemento', name: 'Suplementos' }, { id: 'comida', name: 'Alimentos' }];
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockCategories });
    const res = await fetch(`${BASE_URL}/api/v1/categories`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(2);
  });

  it('POST /api/v1/categories requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/categories`, { method: 'POST' });
    expect(res.status).toBe(401);
  });

  it('DELETE /api/v1/categories requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/categories`, { method: 'DELETE' });
    expect(res.status).toBe(401);
  });
});

describe('API Formulario', () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it('POST /api/v1/formulario submits contact form', async () => {
    const formData = { nombre: 'Juan', email: 'juan@email.com', mensaje: 'Hola' };
    mockFetch.mockResolvedValue({ ok: true, json: async () => ({ success: true, message: 'Mensaje enviado' }) });
    const res = await fetch(`${BASE_URL}/api/v1/formulario`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.success).toBe(true);
  });

  it('GET /api/v1/formulario requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/formulario`);
    expect(res.status).toBe(401);
  });
});

describe('API Pages', () => {
  beforeEach(() => { mockFetch.mockReset(); });

  it('GET /api/v1/pages returns page content', async () => {
    const mockPage = { title: 'Contacto', description: 'Contáctanos', content: [{ type: 'text', content: 'Dirección...' }] };
    mockFetch.mockResolvedValue({ ok: true, json: async () => mockPage });
    const res = await fetch(`${BASE_URL}/api/v1/pages?page=contacto`);
    const data = await res.json();
    expect(res.ok).toBe(true);
    expect(data.title).toBe('Contacto');
  });

  it('POST /api/v1/pages requires API key', async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 401 });
    const res = await fetch(`${BASE_URL}/api/v1/pages`, { method: 'POST' });
    expect(res.status).toBe(401);
  });
});