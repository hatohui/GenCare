'use client'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import clsx from 'clsx'

interface ReturnButtonProps {
	href?: string
	text?: string
	className?: string
}

const ReturnButton: React.FC<ReturnButtonProps> = ({
	href = '/',
	text = 'Return',
	className = '',
}) => (
	<Link
		href={href}
		className={clsx(
			'px-4 py-2 round bg-accent text-white shadow hover:bg-accent/90 transition flex items-center gap-2',
			className
		)}
		aria-label={text}
	>
		<ArrowLeft size={20} className='text-white' />
		<span>{text}</span>
	</Link>
)

export default ReturnButton
