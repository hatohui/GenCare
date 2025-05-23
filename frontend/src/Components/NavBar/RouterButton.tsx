'use client'
import { motion } from 'motion/react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { NavComponentProps } from '../NavBar'
import { COLOR_ON_SCROLL, COLOR_ON_TOP } from '@/Constants/NavBar'

export type RouterButtonProps = {
	label: string
	to: string
}

export type NavButtonProps = NavComponentProps & RouterButtonProps

const RouterButton = ({ className, onTop, label, to }: NavButtonProps) => {
	const router = useRouter()
	const path = usePathname()

	return (
		<motion.button
			id={label}
			className={`${className} flex-1 relative flex py-1 px-1 overflow-hidden min-w-fit cursor-pointer justify-center`}
			animate={onTop ? 'onTop' : 'none'}
			variants={{
				onTop: {
					color: COLOR_ON_TOP,
					fontWeight:
						path === to
							? 'var(--font-weight-bold)'
							: 'var(--font-weight-normal)',
				},
				none: {
					color: COLOR_ON_SCROLL,
					fontWeight:
						path === to
							? 'var(--font-weight-bold)'
							: 'var(--font-weight-normal)',
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
			onClick={() => router.push(to)}
		>
			<label className='z-10 text-center pointer-events-none'>{label}</label>
			<motion.div
				className='absolute top-0 bg-gradient-to-b overflow-hidden w-full h-full pointer-events-none from-transparent from-95% to-accent/100 to-5% z-20'
				initial={{ translateX: '-100%' }}
				animate={path === to ? 'selected' : 'none'}
				transition={{ duration: 0.4, delay: 0.1 }}
				variants={{ selected: { translateX: '0' }, none: {} }}
			></motion.div>
			<motion.div
				className='absolute top-0 bg-gradient-to-b overflow-hidden w-full h-full pointer-events-none from-transparent from-95% to-accent/100 to-5% z-20'
				initial={{ translateX: '100%' }}
				animate={path === to ? 'selected' : 'none'}
				transition={{ duration: 0.4, delay: 0.1 }}
				variants={{ selected: { translateX: '0' }, none: {} }}
			></motion.div>
		</motion.button>
	)
}

export default RouterButton
