'use client';

import { useState, useTransition } from 'react';
import { broadcastAction } from '@/app/admin/actions';
import type { Broadcast, Settings } from '@/lib/products';

export function BroadcastForm({
  broadcasts,
}: {
  broadcasts: Broadcast[];
  settings: Settings;
}) {
  const [message, setMessage] = useState('');
  const [result, setResult] = useState<{
    error?: string;
    waLink?: string;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    const formData = new FormData();
    formData.set('message', message);
    startTransition(async () => {
      const res = await broadcastAction(formData);
      if (res?.error) {
        setResult({ error: res.error });
      } else if (res?.waLink) {
        setResult({ waLink: res.waLink });
        setMessage('');
      }
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold">Broadcast WhatsApp</h2>
        <p className="mt-1 text-sm text-zinc-400">
          Tulis pesan, lalu buat link WhatsApp untuk dikirim ke kontak atau
          grup.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tulis pesan broadcast di sini..."
          rows={4}
          maxLength={500}
          required
          className="w-full rounded-lg border border-ink-border bg-ink px-4 py-3 text-white placeholder-zinc-500 focus:border-accent"
        />
        <button
          type="submit"
          disabled={isPending || !message.trim()}
          className="btn-primary disabled:opacity-50"
        >
          {isPending ? 'Membuat...' : 'Buat Link Broadcast'}
        </button>
      </form>

      {result?.error && (
        <p className="rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-400">
          {result.error}
        </p>
      )}

      {result?.waLink && (
        <div className="rounded-xl border border-accent/30 bg-accent/10 p-4">
          <p className="text-sm text-accent">
            Link broadcast berhasil dibuat:
          </p>
          <a
            href={result.waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary mt-3 inline-flex"
          >
            Kirim via WhatsApp
          </a>
        </div>
      )}

      {broadcasts.length > 0 && (
        <div>
          <h3 className="mb-2 text-sm font-bold text-zinc-300">
            Riwayat Broadcast
          </h3>
          <div className="space-y-2">
            {broadcasts.map((b) => (
              <div
                key={b.id}
                className="rounded-lg border border-ink-border bg-ink-card p-3"
              >
                <p className="text-sm text-zinc-300">{b.message}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-zinc-500">
                    {new Date(b.createdAt).toLocaleString('id-ID')}
                  </span>
                  <a
                    href={b.waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent hover:text-accent-bright"
                  >
                    Buka link
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
