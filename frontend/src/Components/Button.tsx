import clsx from 'clsx'
import React from 'react'

const Button = ({
	id,
	label,
	labelMobile,
	className,
	onClick,
}: {
	id?: string
	label: string
	labelMobile?: string
	className?: string
	onClick?: () => void
}) => {
	return (
		<button
			id={id}
			{...{ onClick }}
			className={clsx(
				className,
				'bg-accent text-white z-30 text-sm px-4 py-2 rounded-[30px] hover:bg-blue-700 transition'
			)}
		>
			<span className='hidden xl:block'>{label}</span>
			<span className='block xl:hidden'>
				{labelMobile ? labelMobile : label}
			</span>
		</button>
	)
}

export default Button
