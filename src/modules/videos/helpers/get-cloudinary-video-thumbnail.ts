/**
 * Gera a URL da thumbnail automática de um vídeo hospedado no Cloudinary.
 * @param videoUrl URL original do vídeo
 */
export function getCloudinaryVideoThumbnail(videoUrl?: string | null): string {
  if (!videoUrl) return "/images/logo.svg"

  if (
    videoUrl.includes("cloudinary.com") &&
    videoUrl.includes("/video/upload/")
  ) {
    return videoUrl
      .replace("/video/upload/", "/video/upload/so_0,f_jpg/")
      .replace(/\.[^/.]+$/, ".jpg")
  }

  return "/images/logo.svg"
}
