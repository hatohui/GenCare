import React from 'react'

export type ItemCardHeaderProps = {
	label: string
	secondaryLabel: string
	thirdLabel: string
	fourthLabel: string
}

const ItemCardHeader = ({
	label,
	secondaryLabel,
	thirdLabel,
	fourthLabel,
}: ItemCardHeaderProps) => {
	return (
		<div
			className='bg-gradient-to-r from-white to-general overflow-hidden text-slate font-semibold px-3 w-full flex justify-between drop-shadow-sm transition-colors duration-300 items-center'
			aria-label={`Table's Category`}
		>
			<div className='absolute top-0 left-0 h-full w-full opacity-60 asfaltBackground' />
			<div className='flex flex-1 items-center gap-3 text-shadow-sm p-3'>
				<p>{label}</p>
			</div>

			<p className='hidden flex-1 sm:block text-left'>{secondaryLabel}</p>

			<div className='items-center flex justify-end gap-2 flex-1'>
				<p className='truncate flex-1 hidden xl:block'>{thirdLabel}</p>
				<div className='flex gap-2 p-3 text-left justify-end'>
					{fourthLabel}
				</div>
			</div>
		</div>
	)
}

export default ItemCardHeader
