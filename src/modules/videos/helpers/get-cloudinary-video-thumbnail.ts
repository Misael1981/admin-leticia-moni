/**
 * Gera a URL da thumbnail automática de um vídeo hospedado no Cloudinary.
 * @param videoUrl - URL completa do vídeo (ex: .../video/upload/v1234/meu-video.mp4)
 * @param publicId - Ou o Cloudinary Public ID
 */
export function getCloudinaryVideoThumbnail(videoUrl?: string | null): string {
  if (!videoUrl) return "/images/logo.svg" // imagem genérica de fallback

  // Se o vídeo for do Cloudinary (contém 'res.cloudinary.com')
  if (videoUrl.includes("cloudinary.com")) {
    // Troca a pasta /video/ por /image/
    // Troca a extensão final (.mp4, .mov, etc) por .jpg
    // Adiciona a transformação 'so_1' (captura o frame do segundo 1)
    return videoUrl
      .replace("/video/upload/", "/image/upload/so_1/")
      .replace(/\.[^/.]+$/, ".jpg")
  }

  return "/images/logo.svg"
}
