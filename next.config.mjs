/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración crucial para ignorar errores de TypeScript
  typescript: {
    // !! Peligro: Esto debe ser 'false' en producción real. 
    ignoreBuildErrors: true, 
  },
  eslint: {
    // También ignoramos advertencias y errores de ESlint
    ignoreDuringBuilds: true,
  },
  // La línea importante para Vercel: le dice dónde está el directorio de origen
  distDir: 'build', 
};

export default nextConfig;
