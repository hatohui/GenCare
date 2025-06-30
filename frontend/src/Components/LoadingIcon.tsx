import React from 'react'

interface LoadingIconProps {
	className?: string
}

const LoadingIcon: React.FC<LoadingIconProps> = ({ className = '' }) => {
	return (
		<div
			className={`h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin ${className}`}
		/>
	)
}

export default LoadingIcon
