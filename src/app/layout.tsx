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
  title: 'RFMstore | Aplikasi Premium Termurah & Terpercaya',
  description:
    'Beli akun premium Netflix, Spotify, Canva, CapCut, YouTube, Disney+, ChatGPT, Adobe dengan harga termurah. Garansi sesuai aplikasi, transaksi via WhatsApp.',
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
