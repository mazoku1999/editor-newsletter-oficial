/** @type {import('next').NextConfig} */
const nextConfig = {
  // Eliminamos la configuración de 'export' para permitir rutas de API dinámicas
  // output: 'export',
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true },
};

module.exports = nextConfig;
