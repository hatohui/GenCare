import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		dangerouslyAllowSVG: true,
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'example.com',
				port: '',
				pathname: '/images/**',
			},
			{
				protocol: 'https',
				hostname: 'cdn.example.com',
				port: '',
				pathname: '/assets/**',
			},
			{
				protocol: 'https',
				hostname: 'another-example.com',
				port: '',
				pathname: '/uploads/**',
			},
		],
	},
	experimental: {
		authInterrupts: true,
	},
}

export default nextConfig
