'use client';

import { useState } from 'react';
import { ProductManager } from './ProductManager';
import { BroadcastForm } from './BroadcastForm';
import { SettingsForm } from './SettingsForm';
import { logoutAction } from '@/app/admin/actions';
import type { Product, Settings, Broadcast } from '@/lib/products';

type TabId = 'products' | 'broadcast' | 'settings';

type DashboardProps = {
  products: Product[];
  settings: Settings;
  broadcasts: Broadcast[];
};

export function Dashboard({ products, settings, broadcasts }: DashboardProps) {
  const [tab, setTab] = useState<TabId>('products');

  const tabs: { id: TabId; label: string }[] = [
    { id: 'products', label: 'Produk' },
    { id: 'broadcast', label: 'Broadcast' },
    { id: 'settings', label: 'Pengaturan' },
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-ink-border bg-ink-surface">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-lg font-bold">Dashboard Admin</h1>
          <form action={logoutAction}>
            <button
              type="submit"
              className="text-sm text-zinc-400 transition-colors hover:text-red-400"
            >
              Logout
            </button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="mb-6 flex gap-1 rounded-lg border border-ink-border bg-ink-card p-1">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                tab === t.id
                  ? 'bg-accent text-ink'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'products' && <ProductManager products={products} />}
        {tab === 'broadcast' && (
          <BroadcastForm broadcasts={broadcasts} settings={settings} />
        )}
        {tab === 'settings' && <SettingsForm settings={settings} />}
      </div>
    </div>
  );
}
