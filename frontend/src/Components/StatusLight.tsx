import clsx from 'clsx'
import React from 'react'

export type Status = 'SUCCESS' | 'PENDING' | 'FAILED' | 'ACTIVE' | 'INACTIVE'

const StatusLight = ({ status }: { status?: Status }) => {
	let statusClass = ''

	switch (status) {
		case 'SUCCESS':
		case 'ACTIVE':
			statusClass = 'bg-lime-500 shadow-lime-400/50'
			break
		case 'PENDING':
			statusClass = 'bg-yellow-500 shadow-yellow-500/50'
			break
		case 'FAILED':
		case 'INACTIVE':
			statusClass = 'bg-red-500 shadow-rose-500/50'
			break
		default:
	}
	return (
		<div
			className={clsx(
				'rounded-full size-4 transition-all animate-pulse duration-300',
				statusClass ? statusClass : 'bg-slate-900',
				statusClass && 'hover:shadow-[0_0_10px] shadow-[0px_0px_10px]'
			)}
			role='status'
			aria-label={`Status: ${status}`}
		/>
	)
}

export default StatusLight
