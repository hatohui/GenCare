'use client'
import { motion } from 'motion/react'

export const CartButton = () => {
	return (
		<motion.button
			initial='rest'
			whileHover='hover'
			animate='rest'
			className='flex items-center justify-center bg-accent text-white px-4 py-2 rounded-full overflow-hidden hover:cursor-pointer'
		>
			<motion.span
				variants={{
					rest: { opacity: 0, x: 0, width: 0 },
					hover: { opacity: 1, x: 0, width: 100 },
				}}
				transition={{ duration: 0.3 }}
				className='whitespace-nowrap font-medium text-sm'
			>
				Giỏ Hàng
			</motion.span>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				strokeWidth='1.5'
				stroke='currentColor'
				className='size-8 hover:scale-110 transition-transform duration-200'
			>
				<path
					strokeLinecap='round'
					strokeLinejoin='round'
					d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
				/>
			</svg>
		</motion.button>
	)
}
