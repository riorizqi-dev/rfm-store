import {
  getAllProductsAdmin,
  getSettings,
  getBroadcasts,
} from '@/lib/products';
import { Dashboard } from '@/components/admin/Dashboard';

export const dynamic = 'force-dynamic';

export default async function KelolaPage() {
  const [products, settings, broadcasts] = await Promise.all([
    getAllProductsAdmin(),
    getSettings(),
    getBroadcasts(),
  ]);

  return (
    <Dashboard
      products={products}
      settings={settings}
      broadcasts={broadcasts}
    />
  );
}
