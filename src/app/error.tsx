'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main>
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="max-w-md text-center">
          <p className="section-tag justify-center">{'// gangguan sebentar'}</p>
          <h1 className="font-disp text-2xl font-bold">
            Server lagi bangun
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            Database free tier tidur kalau lama nggak ada pengunjung. Biasanya
            sekali coba lagi udah normal.
          </p>
          <button onClick={reset} className="btn-primary mt-6">
            Coba Lagi
          </button>
        </div>
      </div>
    </main>
  );
}
