// Environment configuration for chat connections
export const getChatConfig = () => {
	const isDevelopment = process.env.NODE_ENV === 'development'
	const isProduction = process.env.NODE_ENV === 'production'

	// Use environment variables or fallback to defaults
	const API_BASE_URL =
		process.env.NEXT_PUBLIC_API_URL || 'https://api.gencare.site'

	return {
		// Hub URL configuration
		hubUrl: (conversationId: string) =>
			`${API_BASE_URL}/hubs/chat?conversationId=${conversationId}`,

		// Connection options optimized for your setup
		connectionOptions: {
			// Increase timeouts for slow connections and EC2+Cloudflare setup
			serverTimeoutInMilliseconds: 120000, // 2 minutes
			keepAliveIntervalInMilliseconds: 20000, // 20 seconds

			// Add handshake timeout for slow connections
			handshakeTimeoutInMilliseconds: 30000, // 30 seconds

			// Optimize for Cloudflare
			transport: {
				// Try WebSockets first, fallback to long polling
				enabledTransports: ['WebSockets', 'ServerSentEvents', 'LongPolling'],
			},

			// Logging based on environment
			logLevel: isDevelopment ? 'Information' : 'Warning',
		},

		// Reconnection strategy optimized for EC2/Cloudflare
		reconnectOptions: {
			nextRetryDelayInMilliseconds: (retryContext: any) => {
				// More aggressive backoff for production
				const baseDelay = isProduction ? 2000 : 1000
				const maxDelay = isProduction ? 60000 : 30000

				const delay = Math.min(
					baseDelay * Math.pow(2, retryContext.previousRetryCount),
					maxDelay
				)

				console.log(
					`SignalR reconnect attempt ${
						retryContext.previousRetryCount + 1
					}, delay: ${delay}ms`
				)
				return delay
			},
		},
	}
}

export default getChatConfig
