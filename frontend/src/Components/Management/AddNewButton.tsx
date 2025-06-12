'use client'

import { motion } from 'motion/react'
import React from 'react'
import { PlusSVG } from '../SVGs'

const AddNewButton = () => {
	return (
		<motion.button
			className='round z-50 drop-shadow-smt cursor-pointer flex center-all gap-2 border px-3'
			tabIndex={0}
			whileHover={{
				backgroundColor: 'var(--color-accent)',
				color: 'var(--color-general)',
			}}
			transition={{ duration: 0.2 }}
		>
			<span className='pointer-events-none'>
				<PlusSVG />
			</span>
			<span className='whitespace-nowrap pointer-events-none hidden md:block'>
				Add
			</span>
		</motion.button>
	)
}

export default AddNewButton
