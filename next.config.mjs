/** @type {import('next').NextConfig} */
const nextConfig = {
  // Eliminar basePath/assetPrefix para que la app funcione en /
  basePath: '/futbolv2',
  assetPrefix: '/futbolv2',
  typescript: {
    ignoreBuildErrors: true,
  },
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  output: 'export',
}

export default nextConfig
