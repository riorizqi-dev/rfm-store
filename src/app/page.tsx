import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { BroadcastTicker } from '@/components/BroadcastTicker';
import { Ticker } from '@/components/Ticker';
import { WhyUs } from '@/components/WhyUs';
import { ProductSection } from '@/components/ProductSection';
import { HowToBuy } from '@/components/HowToBuy';
import { FAQ } from '@/components/FAQ';
import { CTASection } from '@/components/CTASection';
import { Footer } from '@/components/Footer';
import { getAllProducts, getSettings, getBroadcasts } from '@/lib/products';

// selalu render fresh biar perubahan dari dashboard admin langsung kelihatan
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: Awaited<ReturnType<typeof getAllProducts>> = [];
  let settings: Awaited<ReturnType<typeof getSettings>> | null = null;
  let broadcasts: Awaited<ReturnType<typeof getBroadcasts>> = [];

  try {
    [products, settings, broadcasts] = await Promise.all([
      getAllProducts(),
      getSettings(),
      getBroadcasts(),
    ]);
  } catch {
    return (
      <main>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-disp text-2xl font-bold">Sedang maintenance</h1>
            <p className="mt-2 font-mono text-sm text-muted">
              Silakan coba lagi nanti.
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!settings) {
    return (
      <main>
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="text-center">
            <h1 className="font-disp text-2xl font-bold">
              Data belum dikonfigurasi
            </h1>
            <p className="mt-2 font-mono text-sm text-muted">
              Silakan hubungi admin.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <>
      <Navbar storeName={settings.storeName} />
      <main>
        <Hero settings={settings} />
        <BroadcastTicker broadcasts={broadcasts} />
        <Ticker products={products} />
        <WhyUs settings={settings} />
        <ProductSection products={products} settings={settings} />
        <HowToBuy />
        <FAQ />
        <CTASection settings={settings} />
      </main>
      <Footer settings={settings} />
    </>
  );
}
