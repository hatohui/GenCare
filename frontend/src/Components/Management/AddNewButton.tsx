'use client'

import { motion } from 'motion/react'
import React from 'react'
import { PlusSVG } from '../SVGs'

const AddNewButton = ({ handleAddNew }: { handleAddNew: () => void }) => {
	return (
		<motion.button
			className='round bg-accent text-white shadow-lg border-0 py-2.5 px-8 cursor-pointer flex center-all gap-2 font-medium text-sm min-w-[90px] hover:shadow-xl'
			tabIndex={0}
			whileHover={{
				scale: 1.05,
				boxShadow: '0 8px 20px rgba(254, 107, 106, 0.4)',
			}}
			whileTap={{ scale: 0.95 }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
			onClick={handleAddNew}
			aria-label='Thêm tài khoản mới'
		>
			<motion.span
				className='pointer-events-none'
				whileHover={{ rotate: 90 }}
				transition={{ duration: 0.3 }}
			>
				<PlusSVG />
			</motion.span>
			<span className='whitespace-nowrap pointer-events-none hidden sm:block'>
				Thêm mới
			</span>
		</motion.button>
	)
}

export default AddNewButton
