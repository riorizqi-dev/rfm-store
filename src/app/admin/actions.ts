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
  getSettings,
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
    return { error: 'Username atau password salah.' };
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
    revalidatePath(`/${ADMIN_SECRET}/dashboard`);
    return { success: true, waLink: link };
  } catch {
    return { error: 'Gagal membuat broadcast.' };
  }
}
