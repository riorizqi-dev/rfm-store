import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';
import {
  getAllProductsAdmin,
  getSettings,
  getBroadcasts,
} from '@/lib/products';
import { Dashboard } from '@/components/admin/Dashboard';

const ADMIN_SECRET = process.env.ADMIN_SECRET || 'panel-x7k9m2p4q';

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) {
    redirect(`/${ADMIN_SECRET}`);
  }

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
