import type { NextConfig } from 'next'
import type { RemotePattern } from 'next/dist/shared/lib/image-config'

const invidiousUrls = process.env.NEXT_PUBLIC_INVIDIOUS_URLS ?? ''

const externalImageUrls = invidiousUrls.split(',')

const nextConfig = {
  // https://github.com/nextauthjs/next-auth/discussions/9385
  transpilePackages: ['next-auth'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
      ...externalImageUrls.map((url) => {
        const { protocol, hostname } = new URL(url)

        return {
          protocol: protocol.replace(':', '') as RemotePattern['protocol'],
          hostname,
        }
      }),
    ],
  },
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    if (!config.experiments) {
      config.experiments = {}
    }
    config.experiments.topLevelAwait = true
    return config as unknown
  },
} satisfies NextConfig

export default nextConfig
