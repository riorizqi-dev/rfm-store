import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'products.json');
const PG_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL || '';

export type Variant = { label: string; price: string; popular?: boolean };

export type Product = {
  id: string;
  name: string;
  domain: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  variants: Variant[];
  features: string[];
  active: boolean;
  popular: boolean;
  createdAt: string;
};

export type Settings = {
  storeName: string;
  tagline: string;
  aboutTitle: string;
  aboutText: string;
  waNumber: string;
  waGroup: string;
  waChannel: string;
  waDefaultMessage: string;
};

export type Broadcast = {
  id: string;
  message: string;
  waLink: string;
  createdAt: string;
};

export type StoreData = {
  settings: Settings;
  products: Product[];
  broadcasts: Broadcast[];
};

export type ProductInput = Omit<Product, 'id' | 'createdAt'>;

/* =============== JSON mode (dev lokal) =============== */

async function readJson(): Promise<StoreData> {
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as StoreData;
}

async function writeJson(data: StoreData): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

/* =============== Postgres mode (Vercel) =============== */

const usePg = PG_URL.length > 0;

/* eslint-disable @typescript-eslint/no-explicit-any */
let sqlCache: any = null;
let initDone = false;

async function getSql(): Promise<any> {
  if (!sqlCache) {
    const mod: any = await import('postgres');
    sqlCache = mod.default(PG_URL, {
      ssl: 'require',
      prepare: false,
      max: 3,
      idle_timeout: 5,
      connect_timeout: 10,
    });
  }
  return sqlCache;
}

// koneksi basi di serverless yang hangat: reset client lalu coba sekali lagi
async function withSql<T>(fn: (sql: any) => Promise<T>): Promise<T> {
  try {
    const sql = await getSql();
    return await fn(sql);
  } catch {
    sqlCache = null;
    const sql = await getSql();
    return await fn(sql);
  }
}

async function initSchema(sql: any): Promise<void> {
  if (initDone) return;

  await sql`
    CREATE TABLE IF NOT EXISTS settings (
      id INT PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL,
      CONSTRAINT settings_singleton CHECK (id = 1)
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      domain TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL,
      short_description TEXT NOT NULL,
      long_description TEXT NOT NULL,
      variants JSONB NOT NULL DEFAULT '[]',
      features JSONB NOT NULL DEFAULT '[]',
      active BOOLEAN NOT NULL DEFAULT TRUE,
      popular BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS broadcasts (
      id TEXT PRIMARY KEY,
      message TEXT NOT NULL,
      wa_link TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  // seed sekali dari products.json kalau tabel masih kosong
  const [{ count }] = await sql`SELECT COUNT(*)::int AS count FROM products`;
  const settingsRows = await sql`SELECT id FROM settings WHERE id = 1`;

  if (count === 0 || settingsRows.length === 0) {
    let seed: StoreData | null = null;
    try {
      seed = await readJson();
    } catch {
      seed = null;
    }
    if (seed) {
      if (settingsRows.length === 0) {
        await sql`
          INSERT INTO settings (id, data) VALUES (1, ${sql.json(seed.settings as any)})
          ON CONFLICT (id) DO NOTHING
        `;
      }
      if (count === 0) {
        for (const p of seed.products) {
          await sql`
            INSERT INTO products (
              id, name, domain, category, short_description,
              long_description, variants, features, active, popular, created_at
            ) VALUES (
              ${p.id}, ${p.name}, ${p.domain}, ${p.category}, ${p.shortDescription},
              ${p.longDescription}, ${sql.json(p.variants as any)}, ${sql.json(p.features as any)},
              ${p.active}, ${p.popular}, ${p.createdAt}
            ) ON CONFLICT (id) DO NOTHING
          `;
        }
      }
    }
  }

  initDone = true;
}

function rowToProduct(r: any): Product {
  return {
    id: r.id,
    name: r.name,
    domain: r.domain ?? '',
    category: r.category,
    shortDescription: r.short_description,
    longDescription: r.long_description,
    variants: r.variants ?? [],
    features: r.features ?? [],
    active: r.active,
    popular: r.popular,
    createdAt: new Date(r.created_at).toISOString(),
  };
}

/* =============== Public API =============== */

export async function getAllProducts(): Promise<Product[]> {
  if (usePg) {
    return withSql(async (sql) => {
      await initSchema(sql);
      const rows =
        await sql`SELECT * FROM products WHERE active = TRUE ORDER BY popular DESC, created_at ASC`;
      return rows.map(rowToProduct);
    });
  }
  const data = await readJson();
  return data.products.filter((p) => p.active);
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  if (usePg) {
    return withSql(async (sql) => {
      await initSchema(sql);
      const rows = await sql`SELECT * FROM products ORDER BY created_at ASC`;
      return rows.map(rowToProduct);
    });
  }
  const data = await readJson();
  return data.products;
}

export async function getProduct(id: string): Promise<Product | null> {
  if (usePg) {
    return withSql(async (sql) => {
      await initSchema(sql);
      const rows = await sql`SELECT * FROM products WHERE id = ${id} LIMIT 1`;
      return rows.length > 0 ? rowToProduct(rows[0]) : null;
    });
  }
  const data = await readJson();
  return data.products.find((p) => p.id === id) || null;
}

export async function getSettings(): Promise<Settings> {
  if (usePg) {
    const rows = await withSql(async (sql) => {
      await initSchema(sql);
      return sql`SELECT data FROM settings WHERE id = 1 LIMIT 1`;
    });
    if (rows.length > 0) return rows[0].data as Settings;
  }
  const data = await readJson();
  return data.settings;
}

export async function getBroadcasts(): Promise<Broadcast[]> {
  if (usePg) {
    return withSql(async (sql) => {
      await initSchema(sql);
      const rows =
        await sql`SELECT * FROM broadcasts ORDER BY created_at DESC LIMIT 50`;
      return rows.map((r: any) => ({
        id: r.id,
        message: r.message,
        waLink: r.wa_link,
        createdAt: new Date(r.created_at).toISOString(),
      }));
    });
  }
  const data = await readJson();
  return data.broadcasts;
}

export async function addProduct(input: ProductInput): Promise<Product> {
  const product: Product = {
    ...input,
    id: randomUUID().slice(0, 8),
    createdAt: new Date().toISOString(),
  };

  if (usePg) {
    await withSql(async (sql) => {
      await initSchema(sql);
      await sql`
        INSERT INTO products (
          id, name, domain, category, short_description,
          long_description, variants, features, active, popular, created_at
        ) VALUES (
          ${product.id}, ${product.name}, ${product.domain}, ${product.category},
          ${product.shortDescription}, ${product.longDescription},
          ${sql.json(product.variants as any)}, ${sql.json(product.features as any)},
          ${product.active}, ${product.popular}, ${product.createdAt}
        )
      `;
    });
    return product;
  }

  const data = await readJson();
  data.products.push(product);
  await writeJson(data);
  return product;
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<void> {
  if (usePg) {
    await withSql(async (sql) => {
      await initSchema(sql);
      await sql`
        UPDATE products SET
          name = ${input.name},
          domain = ${input.domain},
          category = ${input.category},
          short_description = ${input.shortDescription},
          long_description = ${input.longDescription},
          variants = ${sql.json(input.variants as any)},
          features = ${sql.json(input.features as any)},
          active = ${input.active},
          popular = ${input.popular}
        WHERE id = ${id}
      `;
    });
    return;
  }

  const data = await readJson();
  const idx = data.products.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error('Product not found');
  data.products[idx] = {
    ...data.products[idx],
    ...input,
    id,
    createdAt: data.products[idx].createdAt,
  };
  await writeJson(data);
}

export async function deleteProduct(id: string): Promise<void> {
  if (usePg) {
    await withSql(async (sql) => {
      await initSchema(sql);
      await sql`DELETE FROM products WHERE id = ${id}`;
    });
    return;
  }
  const data = await readJson();
  data.products = data.products.filter((p) => p.id !== id);
  await writeJson(data);
}

export async function updateSettings(input: Settings): Promise<void> {
  if (usePg) {
    await withSql(async (sql) => {
      await initSchema(sql);
      await sql`
        INSERT INTO settings (id, data) VALUES (1, ${sql.json(input as any)})
        ON CONFLICT (id) DO UPDATE SET data = ${sql.json(input as any)}
      `;
    });
    return;
  }
  const data = await readJson();
  data.settings = { ...data.settings, ...input };
  await writeJson(data);
}

export async function addBroadcast(
  message: string,
  waLink: string
): Promise<Broadcast> {
  const broadcast: Broadcast = {
    id: randomUUID().slice(0, 8),
    message,
    waLink,
    createdAt: new Date().toISOString(),
  };

  if (usePg) {
    await withSql(async (sql) => {
      await initSchema(sql);
      await sql`
        INSERT INTO broadcasts (id, message, wa_link, created_at)
        VALUES (${broadcast.id}, ${broadcast.message}, ${broadcast.waLink}, ${broadcast.createdAt})
      `;
    });
    return broadcast;
  }

  const data = await readJson();
  data.broadcasts.unshift(broadcast);
  data.broadcasts = data.broadcasts.slice(0, 50);
  await writeJson(data);
  return broadcast;
}

export function isDatabaseMode(): boolean {
  return usePg;
}
