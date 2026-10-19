'use client';

import { useState } from 'react';

type LogoProps = {
  domain?: string;
  name: string;
  size?: number;
  className?: string;
};

const LOGO_KEY = process.env.NEXT_PUBLIC_LOGO_DEV_API_KEY;

function FallbackTile({
  name,
  size,
  className,
}: {
  name: string;
  size: number;
  className?: string;
}) {
  const letter = (name || '?').charAt(0).toUpperCase();
  return (
    <span
      className={className}
      role="img"
      aria-label={name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: 10,
        background: '#252b1e',
        border: '1px solid #39412c',
        color: '#e9ede0',
        fontFamily: 'var(--font-disp), sans-serif',
        fontWeight: 700,
        fontSize: size * 0.42,
        lineHeight: 1,
        flexShrink: 0,
      }}
    >
      {letter}
    </span>
  );
}

export function ProductLogo({ domain, name, size = 48, className }: LogoProps) {
  const [useFallback, setUseFallback] = useState(false);

  // 1. Cek logo lokal SVG dari library repo
  const cleanName = (name || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const localLogoMap: Record<string, string> = {
    netflix: '/logos/netflix-icon.svg',
    netflixpremium: '/logos/netflix-icon.svg',
    spotify: '/logos/spotify-icon.svg',
    spotifypremium: '/logos/spotify-icon.svg',
    youtube: '/logos/youtube-icon.svg',
    youtubepremium: '/logos/youtube-icon.svg',
    telegram: '/logos/telegram.svg',
    telegrampremium: '/logos/telegram.svg',
    chatgpt: '/logos/openai-icon.svg',
    chatgptplus: '/logos/openai-icon.svg',
    openai: '/logos/openai-icon.svg',
    apple: '/logos/apple.svg',
    applemusic: '/logos/apple.svg',
    appletv: '/logos/apple.svg',
    lightroom: '/logos/lightroom.svg',
    adobelightroom: '/logos/lightroom.svg',
  };

  const localSvg = localLogoMap[cleanName];

  if (localSvg && !useFallback) {
    return (
      <img
        src={localSvg}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setUseFallback(true)}
        className={className}
        style={{
          borderRadius: 10,
          display: 'inline-block',
          objectFit: 'contain',
          flexShrink: 0,
          background: '#18181b',
          padding: Math.max(3, Math.round(size * 0.12)),
        }}
      />
    );
  }

  // 2. Logo dari logo.dev atau unavatar.io jika domain ada
  if (domain && !useFallback) {
    const src = LOGO_KEY
      ? `https://img.logo.dev/${domain}?token=${LOGO_KEY}&size=128&format=png`
      : `https://unavatar.io/${domain}?fallback=false`;

    return (
      <img
        src={src}
        alt={name}
        width={size}
        height={size}
        loading="lazy"
        onError={() => setUseFallback(true)}
        className={className}
        style={{
          borderRadius: 10,
          display: 'inline-block',
          objectFit: 'contain',
          flexShrink: 0,
          background: '#ffffff',
          padding: Math.max(3, Math.round(size * 0.09)),
        }}
      />
    );
  }

  // 3. Fallback tile huruf
  return <FallbackTile name={name} size={size} className={className} />;
}
