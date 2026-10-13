'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import {
  verifyCredentials,
  createSession,
  destroySession,
  getSession,
} from '@/lib/auth';
import { rateLimit } from '@/lib/rateLimit';
import { sanitizeInput, productSchema, settingsSchema } from '@/lib/validate';
import {
  addProduct,
  updateProduct,
  deleteProduct,
  updateSettings,
  addBroadcast,
  deleteBroadcast,
  getSettings,
  getAllProductsAdmin,
} from '@/lib/products';
import { waLink } from '@/lib/utils';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'panel-x7k9m2p4q';

export async function loginAction(formData: FormData) {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  const rl = rateLimit(`login:${ip}`, 5, 60000);

  if (!rl.success) {
    return {
      error: `Terlalu banyak percobaan. Coba lagi dalam ${rl.retryAfter} detik.`,
    };
  }

  const username = ((formData.get('username') as string) || '').trim();
  const password = (formData.get('password') as string) || '';

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }

  if (username.length > 50 || password.length > 100) {
    return { error: 'Input terlalu panjang.' };
  }

  const valid = await verifyCredentials(username, password);
  if (!valid) {
    const adminUser = (process.env.ADMIN_USERNAME || 'admin').trim().toLowerCase();
    const isUserValid = ['admin', 'rio', 'riorizqi', adminUser].includes(username.trim().toLowerCase());
    if (!isUserValid) {
      return { error: `Username "${username}" tidak dikenal. Gunakan: admin / rio` };
    }
    return { error: `Password salah untuk user "${username}".` };
  }

  await createSession(username);
  redirect(`/${ADMIN_SECRET}/dashboard`);
}

export async function logoutAction() {
  await destroySession();
  redirect(`/${ADMIN_SECRET}`);
}

export async function addProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  let variants, features;
  try {
    variants = JSON.parse((formData.get('variants') as string) || '[]');
    features = JSON.parse((formData.get('features') as string) || '[]');
  } catch {
    return { error: 'Format varian atau fitur tidak valid.' };
  }

  const raw = {
    name: sanitizeInput((formData.get('name') as string) || '', 100),
    domain: sanitizeInput((formData.get('domain') as string) || '', 100),
    category: sanitizeInput((formData.get('category') as string) || '', 50),
    shortDescription: sanitizeInput(
      (formData.get('shortDescription') as string) || '',
      200
    ),
    longDescription: sanitizeInput(
      (formData.get('longDescription') as string) || '',
      2000
    ),
    variants,
    features,
    active: formData.get('active') === 'true',
    popular: formData.get('popular') === 'true',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await addProduct(parsed.data);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true };
  } catch {
    return { error: 'Gagal menambah produk.' };
  }
}

export async function updateProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const id = (formData.get('id') as string) || '';
  if (!id) return { error: 'ID produk tidak valid.' };

  let variants, features;
  try {
    variants = JSON.parse((formData.get('variants') as string) || '[]');
    features = JSON.parse((formData.get('features') as string) || '[]');
  } catch {
    return { error: 'Format varian atau fitur tidak valid.' };
  }

  const raw = {
    name: sanitizeInput((formData.get('name') as string) || '', 100),
    domain: sanitizeInput((formData.get('domain') as string) || '', 100),
    category: sanitizeInput((formData.get('category') as string) || '', 50),
    shortDescription: sanitizeInput(
      (formData.get('shortDescription') as string) || '',
      200
    ),
    longDescription: sanitizeInput(
      (formData.get('longDescription') as string) || '',
      2000
    ),
    variants,
    features,
    active: formData.get('active') === 'true',
    popular: formData.get('popular') === 'true',
  };

  const parsed = productSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await updateProduct(id, parsed.data);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true };
  } catch {
    return { error: 'Gagal memperbarui produk.' };
  }
}

export async function deleteProductAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const id = (formData.get('id') as string) || '';
  if (!id) return { error: 'ID produk tidak valid.' };

  try {
    await deleteProduct(id);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true };
  } catch {
    return { error: 'Gagal menghapus produk.' };
  }
}

export async function updateSettingsAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const raw = {
    storeName: sanitizeInput((formData.get('storeName') as string) || '', 100),
    tagline: sanitizeInput((formData.get('tagline') as string) || '', 200),
    aboutTitle: sanitizeInput(
      (formData.get('aboutTitle') as string) || '',
      200
    ),
    aboutText: sanitizeInput((formData.get('aboutText') as string) || '', 2000),
    waNumber: sanitizeInput((formData.get('waNumber') as string) || '', 30),
    waGroup: sanitizeInput((formData.get('waGroup') as string) || '', 500),
    waChannel: sanitizeInput((formData.get('waChannel') as string) || '', 500),
    waDefaultMessage: sanitizeInput(
      (formData.get('waDefaultMessage') as string) || '',
      500
    ),
  };

  const parsed = settingsSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  try {
    await updateSettings(parsed.data);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true };
  } catch {
    return { error: 'Gagal menyimpan pengaturan.' };
  }
}

export async function bulkImportAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  let items: unknown;
  try {
    items = JSON.parse((formData.get('items') as string) || '[]');
  } catch {
    return { error: 'Data impor tidak valid.' };
  }
  if (!Array.isArray(items) || items.length === 0) {
    return { error: 'Tidak ada produk untuk diimpor.' };
  }
  if (items.length > 100) {
    return { error: 'Maksimal 100 produk per impor.' };
  }

  const replaceAll = formData.get('replaceAll') === 'true';

  const prepared: ReturnType<typeof productSchema.parse>[] = [];
  for (const raw of items) {
    const r = raw as Record<string, unknown>;
    const candidate = {
      name: sanitizeInput(String(r.name ?? ''), 100),
      domain: sanitizeInput(String(r.domain ?? ''), 100),
      category: sanitizeInput(String(r.category ?? 'Lainnya'), 50),
      shortDescription: sanitizeInput(String(r.shortDescription ?? ''), 200),
      longDescription: sanitizeInput(String(r.longDescription ?? ''), 2000),
      variants: Array.isArray(r.variants) ? r.variants : [],
      features: Array.isArray(r.features) ? r.features : [],
      active: r.active !== false,
      popular: r.popular === true,
    };
    const parsed = productSchema.safeParse(candidate);
    if (!parsed.success) {
      return {
        error: `Produk "${candidate.name || 'tanpa nama'}" tidak valid: ${parsed.error.issues[0].message}`,
      };
    }
    prepared.push(parsed.data);
  }

  try {
    if (replaceAll) {
      const existing = await getAllProductsAdmin();
      for (const p of existing) await deleteProduct(p.id);
    }
    for (const p of prepared) await addProduct(p);

    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true, count: prepared.length };
  } catch {
    return { error: 'Gagal menyimpan produk hasil impor.' };
  }
}

export async function broadcastAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const message = sanitizeInput(
    (formData.get('message') as string) || '',
    500
  );
  if (!message) return { error: 'Pesan broadcast wajib diisi.' };

  const settings = await getSettings();
  const link = waLink(settings.waNumber, message);

  try {
    await addBroadcast(message, link);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true, waLink: link };
  } catch {
    return { error: 'Gagal membuat broadcast.' };
  }
}

export async function deleteBroadcastAction(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error('Unauthorized');

  const id = (formData.get('id') as string) || '';
  if (!id) return { error: 'ID broadcast tidak valid.' };

  try {
    await deleteBroadcast(id);
    revalidatePath('/');
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true };
  } catch {
    return { error: 'Gagal menghapus broadcast.' };
  }
}
