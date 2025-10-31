/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración crucial para permitir que la aplicación se construya ignorando 
  // errores de tipo que suelen aparecer con librerías de terceros en el Hackathon.
  typescript: {
    // !! Peligro: Esto debe ser 'false' en producción real. 
    // Usar 'true' solo para el despliegue del hackathon.
    ignoreBuildErrors: true, 
  },
  eslint: {
    // También ignoramos advertencias y errores de ESlint para el build rápido.
    ignoreDuringBuilds: true,
  }
};

export default nextConfig;
