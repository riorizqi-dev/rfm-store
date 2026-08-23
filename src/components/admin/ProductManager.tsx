'use client';

import { useState, useTransition } from 'react';
import { ProductLogo } from '@/components/Logo';
import { formatPrice } from '@/lib/validate';
import {
  addProductAction,
  updateProductAction,
  deleteProductAction,
} from '@/app/admin/actions';
import type { Product } from '@/lib/products';

type Variant = { label: string; price: string; popular: boolean };

type FormState = {
  id?: string;
  name: string;
  domain: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  variants: Variant[];
  features: string[];
  active: boolean;
  popular: boolean;
};

const emptyForm: FormState = {
  name: '',
  domain: '',
  category: '',
  shortDescription: '',
  longDescription: '',
  variants: [{ label: '', price: '', popular: false }],
  features: [''],
  active: true,
  popular: false,
};

const inputClass =
  'w-full rounded-lg border border-ink-border bg-ink px-4 py-2.5 text-white placeholder-zinc-500 focus:border-accent';
const smallInputClass =
  'flex-1 rounded-lg border border-ink-border bg-ink px-3 py-2 text-sm text-white placeholder-zinc-500 focus:border-accent';

export function ProductManager({ products }: { products: Product[] }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isPending, startTransition] = useTransition();

  const startAdd = () => {
    setForm(emptyForm);
    setEditing('new');
    setError('');
    setSuccess('');
  };

  const startEdit = (product: Product) => {
    setForm({
      id: product.id,
      name: product.name,
      domain: product.domain,
      category: product.category,
      shortDescription: product.shortDescription,
      longDescription: product.longDescription,
      variants: product.variants.map((v) => ({
        ...v,
        popular: v.popular || false,
      })),
      features:
        product.features.length > 0 ? [...product.features] : [''],
      active: product.active,
      popular: product.popular,
    });
    setEditing(product.id);
    setError('');
    setSuccess('');
  };

  const cancel = () => {
    setEditing(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.set('name', form.name);
    formData.set('domain', form.domain);
    formData.set('category', form.category);
    formData.set('shortDescription', form.shortDescription);
    formData.set('longDescription', form.longDescription);
    formData.set(
      'variants',
      JSON.stringify(form.variants.filter((v) => v.label && v.price))
    );
    formData.set(
      'features',
      JSON.stringify(form.features.filter((f) => f.trim()))
    );
    formData.set('active', String(form.active));
    formData.set('popular', String(form.popular));

    if (editing === 'new') {
      startTransition(async () => {
        const result = await addProductAction(formData);
        if (result?.error) setError(result.error);
        else {
          setSuccess('Produk berhasil ditambahkan.');
          cancel();
        }
      });
    } else if (editing && form.id) {
      formData.set('id', form.id);
      startTransition(async () => {
        const result = await updateProductAction(formData);
        if (result?.error) setError(result.error);
        else {
          setSuccess('Produk berhasil diperbarui.');
          cancel();
        }
      });
    }
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Yakin hapus produk ini?')) return;
    const formData = new FormData();
    formData.set('id', id);
    startTransition(async () => {
      const result = await deleteProductAction(formData);
      if (result?.error) setError(result.error);
      else setSuccess('Produk dihapus.');
    });
  };

  const addVariant = () =>
    setForm({
      ...form,
      variants: [...form.variants, { label: '', price: '', popular: false }],
    });
  const removeVariant = (idx: number) =>
    setForm({
      ...form,
      variants: form.variants.filter((_, i) => i !== idx),
    });
  const updateVariant = (
    idx: number,
    key: keyof Variant,
    value: string | boolean
  ) =>
    setForm({
      ...form,
      variants: form.variants.map((v, i) =>
        i === idx ? { ...v, [key]: value } : v
      ),
    });

  const addFeature = () => setForm({ ...form, features: [...form.features, ''] });
  const removeFeature = (idx: number) =>
    setForm({ ...form, features: form.features.filter((_, i) => i !== idx) });
  const updateFeature = (idx: number, value: string) =>
    setForm({
      ...form,
      features: form.features.map((f, i) => (i === idx ? value : f)),
    });

  if (editing) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">
            {editing === 'new' ? 'Tambah Produk' : 'Edit Produk'}
          </h2>
          <button
            onClick={cancel}
            className="text-sm text-zinc-400 hover:text-white"
          >
            Batal
          </button>
        </div>

        {error && (
          <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Nama Produk
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                maxLength={100}
                className={inputClass}
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-300">
                Domain Aplikasi
              </label>
              <input
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
                placeholder="cth: netflix.com"
                maxLength={100}
                className={inputClass}
              />
              <p className="mt-1 text-xs text-zinc-500">
                Logo asli otomatis diambil dari Logo.dev. Kosongkan untuk pakai
                huruf inisial.
              </p>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Kategori
            </label>
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              required
              maxLength={50}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Deskripsi Singkat
            </label>
            <input
              value={form.shortDescription}
              onChange={(e) =>
                setForm({ ...form, shortDescription: e.target.value })
              }
              required
              maxLength={200}
              className={inputClass}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Deskripsi Lengkap
            </label>
            <textarea
              value={form.longDescription}
              onChange={(e) =>
                setForm({ ...form, longDescription: e.target.value })
              }
              required
              maxLength={2000}
              rows={4}
              className={inputClass}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">
                Varian / Durasi
              </label>
              <button
                type="button"
                onClick={addVariant}
                className="text-sm text-accent hover:text-accent-bright"
              >
                + Tambah Varian
              </button>
            </div>
            <div className="space-y-2">
              {form.variants.map((v, idx) => (
                <div key={idx} className="flex flex-wrap items-center gap-2">
                  <input
                    placeholder="Label (cth: 1 Bulan)"
                    value={v.label}
                    onChange={(e) =>
                      updateVariant(idx, 'label', e.target.value)
                    }
                    className={smallInputClass}
                  />
                  <input
                    placeholder="Harga (cth: 25000)"
                    value={v.price}
                    onChange={(e) =>
                      updateVariant(idx, 'price', e.target.value)
                    }
                    className={`${smallInputClass} w-32 flex-none`}
                  />
                  <label className="flex items-center gap-1 text-xs text-zinc-400">
                    <input
                      type="checkbox"
                      checked={v.popular}
                      onChange={(e) =>
                        updateVariant(idx, 'popular', e.target.checked)
                      }
                      className="accent-accent"
                    />
                    Populer
                  </label>
                  {form.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeVariant(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-medium text-zinc-300">Fitur</label>
              <button
                type="button"
                onClick={addFeature}
                className="text-sm text-accent hover:text-accent-bright"
              >
                + Tambah Fitur
              </button>
            </div>
            <div className="space-y-2">
              {form.features.map((f, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    placeholder="Fitur (cth: 4K Ultra HD)"
                    value={f}
                    onChange={(e) => updateFeature(idx, e.target.value)}
                    className={smallInputClass}
                  />
                  {form.features.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeFeature(idx)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) =>
                  setForm({ ...form, active: e.target.checked })
                }
                className="accent-accent"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 text-sm text-zinc-300">
              <input
                type="checkbox"
                checked={form.popular}
                onChange={(e) =>
                  setForm({ ...form, popular: e.target.checked })
                }
                className="accent-accent"
              />
              Produk Populer
            </label>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="btn-primary w-full disabled:opacity-50"
          >
            {isPending ? 'Menyimpan...' : 'Simpan'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent">
          {success}
        </p>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">
          Daftar Produk ({products.length})
        </h2>
        <button
          onClick={startAdd}
          className="btn-primary px-4 py-2 text-sm"
        >
          + Tambah Produk
        </button>
      </div>

      <div className="space-y-2">
        {products.map((product) => {
          const prices = product.variants
            .map((v) => parseInt(v.price, 10))
            .filter((p) => !isNaN(p));
          const minPrice =
            prices.length > 0 ? Math.min(...prices) : 0;
          return (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-xl border border-ink-border bg-ink-card p-4"
            >
              <ProductLogo domain={product.domain} name={product.name} size={40} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold">{product.name}</h3>
                  {!product.active && (
                    <span className="text-xs text-zinc-500">
                      (Nonaktif)
                    </span>
                  )}
                  {product.popular && (
                    <span className="badge-accent text-[10px]">Populer</span>
                  )}
                </div>
                <p className="text-sm text-zinc-500">
                  {product.category} - {formatPrice(String(minPrice))} -{' '}
                  {product.variants.length} varian
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEdit(product)}
                  disabled={isPending}
                  className="rounded-lg border border-ink-border px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-accent/50 hover:text-accent disabled:opacity-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  disabled={isPending}
                  className="rounded-lg border border-ink-border px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:opacity-50"
                >
                  Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
