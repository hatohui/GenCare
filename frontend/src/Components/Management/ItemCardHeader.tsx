import React from 'react'

export type ItemCardHeaderProps = {
	label: string
	secondaryLabel: string
	thirdLabel?: string
	fourthLabel?: string
	fifthLabel?: string
}

const ItemCardHeader = ({
	label,
	secondaryLabel,
	thirdLabel,
	fourthLabel,
	fifthLabel,
}: ItemCardHeaderProps) => {
	return (
		<div
			className='mx-2 bg-gradient-to-r from-white to-general overflow-hidden text-slate font-semibold px-4 py-2 flex justify-between drop-shadow-sm transition-colors duration-300 items-center relative round'
			aria-label={`Table's Category`}
		>
			<div className='absolute inset-0 opacity-30 asfaltBackground pointer-events-none' />

			<div className='flex items-center gap-3 flex-3/12'>
				<p className='text-sm text-slate-900 px-5'>{label}</p>
			</div>

			<div className='hidden flex-3/12 text-sm text-slate-900 sm:flex'>
				{secondaryLabel}
			</div>

			<div className='hidden justify-center text-sm text-slate-900 flex-1/12 xl:flex'>
				{thirdLabel}
			</div>

			<div className='hidden justify-center text-sm text-slate-900 flex-2/12 xl:flex'>
				{fourthLabel}
			</div>

			<div className='flex items-center justify-center flex-1/12 text-sm text-slate-900'>
				{fifthLabel}
			</div>
		</div>
	)
}

export default ItemCardHeader
