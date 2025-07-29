'use client'

import React from 'react'
import { Wifi, WifiOff, Loader2, AlertTriangle } from 'lucide-react'
import * as signalR from '@microsoft/signalr'

interface ConnectionStatusProps {
	connected: boolean
	connectionState?: signalR.HubConnectionState
	className?: string
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
	connected,
	connectionState,
	className = '',
}) => {
	const getStatusInfo = () => {
		switch (connectionState) {
			case signalR.HubConnectionState.Connected:
				return {
					icon: <Wifi className='w-4 h-4' />,
					text: 'Connected',
					color: 'text-green-600 bg-green-100',
				}
			case signalR.HubConnectionState.Connecting:
				return {
					icon: <Loader2 className='w-4 h-4 animate-spin' />,
					text: 'Connecting...',
					color: 'text-blue-600 bg-blue-100',
				}
			case signalR.HubConnectionState.Reconnecting:
				return {
					icon: <Loader2 className='w-4 h-4 animate-spin' />,
					text: 'Reconnecting...',
					color: 'text-yellow-600 bg-yellow-100',
				}
			case signalR.HubConnectionState.Disconnected:
				return {
					icon: <WifiOff className='w-4 h-4' />,
					text: 'Disconnected',
					color: 'text-red-600 bg-red-100',
				}
			case signalR.HubConnectionState.Disconnecting:
				return {
					icon: <Loader2 className='w-4 h-4 animate-spin' />,
					text: 'Disconnecting...',
					color: 'text-gray-600 bg-gray-100',
				}
			default:
				return {
					icon: <AlertTriangle className='w-4 h-4' />,
					text: 'Unknown',
					color: 'text-gray-600 bg-gray-100',
				}
		}
	}

	const { icon, text, color } = getStatusInfo()

	// Only show if not connected or if in a transitional state
	if (connected && connectionState === signalR.HubConnectionState.Connected) {
		return null
	}

	return (
		<div
			className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color} ${className}`}
		>
			{icon}
			<span>{text}</span>
		</div>
	)
}

export default ConnectionStatus
