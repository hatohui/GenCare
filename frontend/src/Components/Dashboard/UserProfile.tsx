import React, { useRef, useEffect, useState } from 'react'
import { OptionSVG } from '../SVGs'
import Popup from './Popup'
import { useAccountStore } from '@/Hooks/useAccount'
import { CldImage } from 'next-cloudinary'
import { AnimatePresence, motion } from 'motion/react'
import FallBackUserImage from '../Profile/FallBackUserImage'

const UserProfile = ({ collapsed = false }: { collapsed?: boolean }) => {
	const [showPopUp, setShowPopUp] = useState(false)
	const { data } = useAccountStore()
	const containerRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				showPopUp &&
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setShowPopUp(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [showPopUp])

	return (
		<div
			ref={containerRef}
			onClick={() => setShowPopUp(prev => !prev)}
			className='relative hidden md:flex justify-start items-center gap-2 rounded-sm px-2 py-1 hover:bg-gray-100 dark:hover:bg-slate-700/50 cursor-pointer'
		>
			<AnimatePresence>
				{showPopUp && (
					<motion.div
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: -10 }}
						transition={{ duration: 0.3, ease: 'easeInOut' }}
						className='absolute top-full mt-2 right-0 z-50'
					>
						<Popup />
					</motion.div>
				)}
			</AnimatePresence>

			{data?.avatarUrl ? (
				<CldImage
					className='rounded-full bg-amber-50 object-cover'
					src={data?.avatarUrl}
					alt='avatar'
					width={30}
					height={30}
				/>
			) : (
				<FallBackUserImage />
			)}

			{!collapsed && (
				<div className='flex flex-col items-start max-w-full'>
					<div className='text-sm text-general'>{data?.firstName}</div>
					<div
						className='text-xs text-slate-300 truncate overflow-hidden max-w-[11rem]'
						style={{ WebkitLineClamp: 1 }}
					>
						{data?.email}
					</div>
				</div>
			)}

			{!collapsed && (
				<OptionSVG className='hover:bg-black-500 absolute right-1 top-1/2 -translate-y-1/2' />
			)}
		</div>
	)
}

export default UserProfile
