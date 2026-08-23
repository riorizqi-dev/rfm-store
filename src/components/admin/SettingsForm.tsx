'use client';

import { useState, useTransition } from 'react';
import { updateSettingsAction } from '@/app/admin/actions';
import type { Settings } from '@/lib/products';

export function SettingsForm({ settings }: { settings: Settings }) {
  const [form, setForm] = useState<Settings>(settings);
  const [result, setResult] = useState<{
    error?: string;
    success?: boolean;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.set(key, value);
    });
    startTransition(async () => {
      const res = await updateSettingsAction(formData);
      setResult(res);
    });
  };

  const update = (key: keyof Settings, value: string) =>
    setForm({ ...form, [key]: value });

  const fields: {
    key: keyof Settings;
    label: string;
    maxLength: number;
    textarea?: boolean;
  }[] = [
    { key: 'storeName', label: 'Nama Toko', maxLength: 100 },
    { key: 'tagline', label: 'Tagline', maxLength: 200 },
    { key: 'aboutTitle', label: 'Judul Tentang', maxLength: 200 },
    {
      key: 'aboutText',
      label: 'Teks Tentang',
      maxLength: 2000,
      textarea: true,
    },
    {
      key: 'waNumber',
      label: 'Nomor WhatsApp (format: 628xxx)',
      maxLength: 30,
    },
    { key: 'waGroup', label: 'Link Grup WhatsApp', maxLength: 500 },
    {
      key: 'waChannel',
      label: 'Link Saluran WhatsApp (opsional)',
      maxLength: 500,
    },
    {
      key: 'waDefaultMessage',
      label: 'Pesan Default WhatsApp',
      maxLength: 500,
      textarea: true,
    },
  ];

  const inputClass =
    'w-full rounded-lg border border-ink-border bg-ink px-4 py-2.5 text-white placeholder-zinc-500 focus:border-accent';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-lg font-bold">Pengaturan Toko</h2>

      {result?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {result.error}
        </p>
      )}
      {result?.success && (
        <p className="rounded-lg bg-accent/10 px-4 py-2 text-sm text-accent">
          Pengaturan tersimpan.
        </p>
      )}

      {fields.map((field) => (
        <div key={field.key}>
          <label className="mb-1 block text-sm font-medium text-zinc-300">
            {field.label}
          </label>
          {field.textarea ? (
            <textarea
              value={form[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              required
              maxLength={field.maxLength}
              rows={4}
              className={inputClass}
            />
          ) : (
            <input
              type="text"
              value={form[field.key]}
              onChange={(e) => update(field.key, e.target.value)}
              required
              maxLength={field.maxLength}
              className={inputClass}
            />
          )}
        </div>
      ))}

      <button
        type="submit"
        disabled={isPending}
        className="btn-primary w-full disabled:opacity-50"
      >
        {isPending ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  );
}
