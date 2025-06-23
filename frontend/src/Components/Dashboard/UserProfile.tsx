'use client'
import React, { useState } from 'react'
import { OptionSVG } from '../SVGs'
import Popup from './Popup'
import { useAccountStore } from '@/Hooks/useAccount'
import { CldImage } from 'next-cloudinary'
import { motion } from 'motion/react'

const UserProfile = () => {
	const [showPopUp, setShowPopUp] = useState(false)
	const { data } = useAccountStore()

	const variants = {
		hidden: { opacity: 0, x: -10 },
		visible: { opacity: 1, x: 0 },
	}

	return (
		<div
			onClick={() => setShowPopUp(prev => !prev)}
			className='relative hidden md:flex justify-start items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer'
		>
			<motion.div
				variants={variants}
				initial='hidden'
				animate={showPopUp ? 'visible' : 'hidden'}
				transition={{ duration: 0.3, ease: 'easeInOut' }}
				className='absolute top-0 left-0 translate-x-1/3 w-full h-full z-10 '
				style={{ display: showPopUp ? '' : 'none' }}
			>
				<Popup />
			</motion.div>

			{data?.avatarUrl ? (
				<CldImage
					className='rounded-full bg-amber-50 object-cover'
					src={data?.avatarUrl}
					alt='avatar'
					width={30}
					height={30}
				/>
			) : (
				<div className='w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center text-sm font-bold text-gray-900'>
					{data?.firstName?.charAt(0)}
				</div>
			)}

			<div className='flex flex-col items-start'>
				<div className='text-sm text-general'>{data?.firstName}</div>
				<div className='text-xs text-slate-300'>{data?.email}</div>
			</div>

			<OptionSVG className='hover:bg-black-500 absolute right-1 top-1/2 -translate-y-1/2' />
		</div>
	)
}

export default UserProfile
