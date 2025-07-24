import React from 'react'

interface FlorageBackgroundProps {
	className?: string
}

const FlorageBackground: React.FC<FlorageBackgroundProps> = ({ className }) => {
	return (
		<div
			className={`absolute florageBackground top-0 inset-0 opacity-65 -z-10 ${className}`}
		/>
	)
}

export default FlorageBackground
