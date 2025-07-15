'use client'

import { motion } from 'motion/react'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'
import { CldImage } from 'next-cloudinary'

interface ConsultantCardProps {
	consultant: Consultant
	onClick?: (consultant: Consultant) => void
}

export const ConsultantCard = ({
	consultant,
	onClick,
}: ConsultantCardProps) => {
	const fullName =
		`${consultant.firstName ?? ''} ${consultant.lastName ?? ''}`.trim() ?? 'N/A'
	const genderText = consultant.gender ? 'Male' : 'Female'
	const initials =
		fullName !== 'N/A'
			? fullName
					.split(' ')
					.map(n => n[0])
					.join('')
					.toUpperCase()
			: 'N/A'

	const handleClick = () => {
		if (onClick) {
			onClick(consultant)
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, x: -20, y: -10 }}
			animate={{ opacity: 1, x: 0, y: 0 }}
			whileHover={{ scale: 1.02 }}
			transition={{ duration: 0.5, ease: 'easeOut' }}
			className={`bg-white rounded-2xl p-5 h-full shadow-md hover:shadow-lg transition-shadow duration-300 ${
				onClick ? 'cursor-pointer' : ''
			}`}
			onClick={handleClick}
		>
			<div className='flex items-center gap-4 mb-4'>
				<div className='relative'>
					{consultant.avatarUrl ? (
						<CldImage
							src={consultant.avatarUrl}
							alt={fullName}
							width={64}
							height={64}
							className='rounded-full object-cover'
						/>
					) : (
						<div className='w-16 h-16 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-lg'>
							{initials}
						</div>
					)}
				</div>
				<div className='flex-1'>
					<h3 className='text-lg font-semibold text-gray-900 mb-1'>
						{fullName}
					</h3>
					<p className='text-sm text-gray-600 mb-2'>{consultant.degree}</p>
					<div className='flex items-center gap-2'>
						<span className='bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs'>
							{consultant.department}
						</span>
						<span className='bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs'>
							{genderText}
						</span>
					</div>
				</div>
			</div>

			<div className='space-y-2'>
				{consultant.yearOfExperience > 0 && (
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs'>
							👤
						</span>
						<span>{consultant.yearOfExperience} years of experience</span>
					</div>
				)}

				{consultant.email && (
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs'>
							📧
						</span>
						<span className='truncate'>{consultant.email}</span>
					</div>
				)}

				{consultant.phoneNumber && (
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs'>
							📞
						</span>
						<span>{consultant.phoneNumber}</span>
					</div>
				)}

				{consultant.dateOfBirth && (
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='w-4 h-4 bg-gray-200 rounded-full flex items-center justify-center text-xs'>
							📅
						</span>
						<span>{new Date(consultant.dateOfBirth).toLocaleDateString()}</span>
					</div>
				)}

				{consultant.biography && (
					<div className='mt-3'>
						<p className='text-sm text-gray-700 line-clamp-3'>
							{consultant.biography}
						</p>
					</div>
				)}
			</div>
		</motion.div>
	)
}
