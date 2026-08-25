export function RFMLogo({ size = 30 }: { size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo-rfm.png"
      alt="RFMstore"
      width={size}
      height={size}
      className="rounded-md"
      style={{ display: 'block', flexShrink: 0, objectFit: 'cover' }}
    />
  );
}
