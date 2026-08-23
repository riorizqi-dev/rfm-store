import { z } from 'zod';

export function sanitizeInput(input: string, maxLength: number = 2000): string {
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]*>/g, '')
    .trim()
    .slice(0, maxLength);
}

export const variantSchema = z.object({
  label: z.string().min(1).max(50),
  price: z.string().min(1).max(50),
  popular: z.boolean().optional(),
});

export const productSchema = z.object({
  name: z.string().min(1).max(100),
  domain: z.string().max(100),
  category: z.string().min(1).max(50),
  shortDescription: z.string().min(1).max(200),
  longDescription: z.string().min(1).max(2000),
  variants: z.array(variantSchema).min(1),
  features: z.array(z.string().min(1).max(200)).min(1),
  active: z.boolean(),
  popular: z.boolean(),
});

export const settingsSchema = z.object({
  storeName: z.string().min(1).max(100),
  tagline: z.string().min(1).max(200),
  aboutTitle: z.string().min(1).max(200),
  aboutText: z.string().min(1).max(2000),
  waNumber: z.string().min(1).max(30),
  waGroup: z.string().min(1).max(500),
  waChannel: z.string().max(500),
  waDefaultMessage: z.string().min(1).max(500),
});

export function formatPrice(priceStr: string): string {
  const num = parseInt(priceStr, 10);
  if (isNaN(num)) return priceStr;
  return 'Rp ' + num.toLocaleString('id-ID');
}
