import * as signalR from '@microsoft/signalr'

export class ConnectionHealthMonitor {
	private pingInterval: NodeJS.Timeout | null = null
	private lastPongTime: number = 0
	private connection: signalR.HubConnection
	private onHealthChange?: (isHealthy: boolean) => void
	private isMonitoring = false
	private readonly PING_INTERVAL = 30000 // 30 seconds
	private readonly TIMEOUT_THRESHOLD = 60000 // 60 seconds

	constructor(connection: signalR.HubConnection) {
		this.connection = connection
	}

	start(onHealthChange?: (isHealthy: boolean) => void): void {
		if (this.isMonitoring) {
			return
		}

		this.onHealthChange = onHealthChange
		this.isMonitoring = true
		this.lastPongTime = Date.now()

		// Set up ping/pong mechanism
		this.connection.on('Pong', () => {
			this.lastPongTime = Date.now()
		})

		// Start ping interval
		this.pingInterval = setInterval(() => {
			this.checkHealth()
		}, this.PING_INTERVAL)

		console.log('Connection health monitor started')
	}

	stop(): void {
		if (this.pingInterval) {
			clearInterval(this.pingInterval)
			this.pingInterval = null
		}

		this.connection.off('Pong')
		this.isMonitoring = false
		console.log('Connection health monitor stopped')
	}

	private async checkHealth(): Promise<void> {
		if (
			!this.isMonitoring ||
			this.connection.state !== signalR.HubConnectionState.Connected
		) {
			return
		}

		try {
			// Send ping to server
			await this.connection.invoke('Ping')

			// Check if we received a recent pong
			const timeSinceLastPong = Date.now() - this.lastPongTime
			const isHealthy = timeSinceLastPong < this.TIMEOUT_THRESHOLD

			if (!isHealthy) {
				console.warn(
					`Connection health check failed. Last pong: ${timeSinceLastPong}ms ago`
				)
			}

			this.onHealthChange?.(isHealthy)
		} catch (error) {
			console.error('Health check ping failed:', error)
			this.onHealthChange?.(false)
		}
	}

	getCurrentHealth(): { isHealthy: boolean; lastPongAge: number } {
		const lastPongAge = Date.now() - this.lastPongTime
		const isHealthy = lastPongAge < this.TIMEOUT_THRESHOLD

		return {
			isHealthy,
			lastPongAge,
		}
	}
}

export default ConnectionHealthMonitor
