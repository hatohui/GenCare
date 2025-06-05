import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	devIndicators: false,
	images: {
		dangerouslyAllowSVG: true,
	},
	experimental: {
		authInterrupts: true,
	},
}

export default nextConfig
