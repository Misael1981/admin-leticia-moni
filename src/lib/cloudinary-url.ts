// src/lib/cloudinary-url.ts  (arquivo novo, sem SDK, client-safe)
export function getOptimizedVideoUrl(
  publicId: string | null,
  fallbackUrl: string,
) {
  if (!publicId) return fallbackUrl

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

  return `https://res.cloudinary.com/${cloudName}/video/upload/f_auto,q_auto/${publicId}`
}
