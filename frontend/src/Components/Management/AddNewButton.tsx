'use client'

import { motion } from 'motion/react'
import React from 'react'
import { PlusSVG } from '../SVGs'

const AddNewButton = ({ handleAddNew }: { handleAddNew: () => void }) => {
	return (
		<motion.button
			className='round z-50 max-h-16 py-2 drop-shadow-smt cursor-pointer flex center-all gap-2 border px-3'
			tabIndex={0}
			whileHover={{
				backgroundColor: 'var(--color-accent)',
				color: 'var(--color-general)',
			}}
			transition={{ duration: 0.2 }}
			onClick={handleAddNew}
		>
			<span className='pointer-events-none'>
				<PlusSVG />
			</span>
			<span className='whitespace-nowrap pointer-events-none hidden md:block'>
				Tạo
			</span>
		</motion.button>
	)
}

export default AddNewButton
