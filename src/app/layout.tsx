import type { Metadata } from 'next';
import { Inter, Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-disp',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.ryuuka.web.id'),
  title: 'RFMstore | Aplikasi Premium Termurah & Terpercaya',
  description:
    'Beli akun premium Netflix, Spotify, Canva, CapCut, YouTube, Disney+, ChatGPT, Adobe dengan harga termurah. Garansi sesuai aplikasi, transaksi via WhatsApp.',
  openGraph: {
    title: 'RFMstore | Aplikasi Premium Termurah & Terpercaya',
    description:
      'Beli akun premium Netflix, Spotify, Canva, CapCut, YouTube, Disney+, ChatGPT, Adobe dengan harga termurah. Garansi sesuai aplikasi, transaksi via WhatsApp.',
    url: 'https://www.ryuuka.web.id',
    siteName: 'RFMstore',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RFMstore - Aplikasi Premium Termurah & Terpercaya',
      },
    ],
    locale: 'id_ID',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RFMstore | Aplikasi Premium Termurah & Terpercaya',
    description:
      'Beli akun premium Netflix, Spotify, Canva, CapCut, YouTube, Disney+, ChatGPT, Adobe dengan harga termurah. Garansi sesuai aplikasi, transaksi via WhatsApp.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${grotesk.variable} ${mono.variable}`}
    >
      <body className="font-sans bg-ink text-body antialiased">{children}</body>
    </html>
  );
}
