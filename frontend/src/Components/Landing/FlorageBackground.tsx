import clsx from 'clsx'
import React from 'react'

interface FlorageBackgroundProps {
	className?: string
}

const FlorageBackground: React.FC<FlorageBackgroundProps> = ({ className }) => {
	return (
		<div
			className={clsx(
				className,
				`absolute florageBackground top-0 inset-0 opacity-[95%] -z-10`
			)}
		/>
	)
}

export default FlorageBackground
