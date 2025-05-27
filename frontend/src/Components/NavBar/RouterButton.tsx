'use client'
import { motion } from 'motion/react'
import { usePathname } from 'next/navigation'
import React from 'react'
import Link from 'next/link'
import { COLOR_ON_TOP, COLOR_ON_SCROLL } from '@/Constants/NavBar'
import clsx from 'clsx'
import { NavComponentProps } from '@/Interfaces/NavBar/Types/NavBarComponents'

export type RouterButtonProps = {
	label: string
	to: string
}

export type NavButtonProps = NavComponentProps & RouterButtonProps

const RouterButton = ({
	className,
	onTop,
	label,
	to,
	index,
}: NavButtonProps & { index: number }) => {
	const path = usePathname()

	return (
		<Link id={label} href={to} tabIndex={index} role='link' className='z-30'>
			<motion.div
				className={clsx(
					className,
					'flex-1 z-0 relative flex py-1 px-1 overflow-hidden w-[89px] cursor-pointer bg-clip-text mix-blend-difference justify-center'
				)}
				animate={onTop ? 'onTop' : 'none'}
				variants={{
					onTop: {
						color: COLOR_ON_TOP,
						fontWeight:
							path === to
								? 'var(--font-weight-bold)'
								: 'var(--font-weight-normal)',
						mixBlendMode: 'difference',
					},
					none: {
						color: COLOR_ON_SCROLL,
						fontWeight:
							path === to
								? 'var(--font-weight-bold)'
								: 'var(--font-weight-normal)',
						mixBlendMode: 'difference',
					},
				}}
				whileHover={{
					filter:
						onTop && path !== to
							? 'brightness(0.8) hue-rotate(180deg)'
							: 'brightness(0.8) saturate(120%) hue-rotate(30deg)',
					transition: {
						filter: {
							duration: 0.2,
						},
					},
				}}
			>
				<label
					className={`z-10 text-center scale-90 pointer-events-none ${
						path === to ? 'brightness-125' : 'brightness-90'
					}`}
				>
					{label}
				</label>
				<motion.div
					className='absolute top-0 left-0 w-full h-full pointer-events-none bg-gradient-to-b from-transparent from-95% to-accent/100 to-5% z-20'
					initial={{ scaleX: 0 }}
					animate={path === to ? 'selected' : 'none'}
					variants={{
						selected: { scaleX: 1 },
						none: { scaleX: 0 },
					}}
					transition={{ duration: 0.4, ease: 'easeOut' }}
					style={{ originX: 0.5 }}
				></motion.div>
			</motion.div>
		</Link>
	)
}

export default RouterButton
