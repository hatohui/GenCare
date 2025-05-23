'use client'
import { motion } from 'motion/react'
import React, { useState } from 'react'

export type MobileMenu = {
	className: string
}

const MobileMenu = ({ className }: MobileMenu) => {
	const [isOpened, setOpened] = useState(false)

	return (
		<button
			className={`${className} relative size-8 shadow-inner border flex items-center justify-center`}
			id='icon'
			onClick={() => setOpened(!isOpened)}
		>
			<motion.svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='white'
				className='size-8 absolute inset-0'
				initial='hide'
				animate={isOpened ? 'show' : 'hide'}
				variants={{
					hide: {
						opacity: 0,
					},
					show: {
						opacity: 1,
					},
				}}
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5'
				/>
			</motion.svg>
			<motion.svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth={1.5}
				stroke='white'
				className='size-8 absolute inset-0'
				initial='hide'
				animate={isOpened ? 'show' : 'hide'}
				variants={{
					hide: {
						opacity: 1,
					},
					show: {
						opacity: 0,
					},
				}}
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M6 18 18 6M6 6l12 12'
				/>
			</motion.svg>
		</button>
	)
}

export default MobileMenu
