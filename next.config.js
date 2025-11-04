/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
  },
  serverExternalPackages: [],
  env: {
    ALPHA_VANTAGE_API_KEY: process.env.ALPHA_VANTAGE_API_KEY,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig
