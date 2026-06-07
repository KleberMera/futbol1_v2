// Permite desactivar el basePath solo en entornos de previsualización
// (p. ej. v0) sin afectar producción. En producción NO se define esta
// variable, por lo que se mantiene '/futbolv2'.
const DISABLE_BASE_PATH = process.env.NEXT_PUBLIC_DISABLE_BASE_PATH === '1'
const BASE_PATH = DISABLE_BASE_PATH ? '' : '/futbolv2'

/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: BASE_PATH,
  assetPrefix: BASE_PATH || undefined,
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
