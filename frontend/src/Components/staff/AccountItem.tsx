import { Account } from '@/Interfaces/Auth/Types/Account'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { UserSVG, MoneySVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import { useLocale } from '@/Hooks/useLocale'

interface AccountItemProps {
	item: Account
}

const AccountItem = ({ item }: AccountItemProps) => {
	const { t } = useLocale()
	const router = useRouter()
	const [isLoading, setIsLoading] = useState(false)
	const [imageError, setImageError] = useState(false)

	const handleClick = () => {
		setIsLoading(true)
		router.push(`/dashboard/payments/${item.id}`)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleClick()
		}
	}

	const formatDate = (dateString: string) => {
		try {
			return new Date(dateString).toLocaleDateString('vi-VN', {
				year: 'numeric',
				month: 'short',
				day: 'numeric',
			})
		} catch {
			return 'N/A'
		}
	}

	return (
		<motion.div
			whileHover={{
				scale: 1.02,
				boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
			}}
			whileTap={{ scale: 0.98 }}
			transition={{ duration: 0.2 }}
			className='relative group'
		>
			<div
				className={`
					flex flex-col gap-4 rounded-[30px] bg-white p-6 h-[280px] 
					cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
					border border-gray-200 hover:border-accent/50 transition-all duration-300
					${isLoading ? 'pointer-events-none opacity-75' : ''}
				`}
				onClick={handleClick}
				onKeyDown={handleKeyDown}
				role='button'
				tabIndex={0}
				aria-label={t('staff.view_payment_details', {
					firstName: item.firstName,
					lastName: item.lastName,
				})}
			>
				{/* Loading Overlay */}
				{isLoading && (
					<div className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-[30px] z-10'>
						<div className='flex items-center gap-2 text-main'>
							<LoadingIcon className='size-4' />
							<span className='text-sm font-medium'>
								{t('staff.redirecting')}
							</span>
						</div>
					</div>
				)}

				{/* Avatar Section */}
				<div className='flex justify-center'>
					<div className='relative'>
						{!imageError && item.avatarUrl ? (
							<CldImage
								src={item.avatarUrl}
								width={80}
								height={80}
								alt={`${item.firstName} ${item.lastName}`}
								className='rounded-full border-4 border-gray-100 group-hover:border-accent/20 transition-colors'
								onError={() => setImageError(true)}
							/>
						) : (
							<div className='w-20 h-20 rounded-full bg-gradient-to-br from-main to-accent flex items-center justify-center border-4 border-gray-100 group-hover:border-accent/20 transition-colors'>
								<UserSVG className='size-8 text-white' />
							</div>
						)}

						{/* Status Indicator */}
						<div className='absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center'>
							<div className='w-2 h-2 bg-white rounded-full'></div>
						</div>
					</div>
				</div>

				{/* User Info */}
				<div className='text-center space-y-2'>
					<h3 className='text-lg font-bold text-gray-900 group-hover:text-main transition-colors'>
						{item.firstName} {item.lastName}
					</h3>
					<p className='text-sm text-gray-500 truncate' title={item.email}>
						{item.email}
					</p>
					<p className='text-xs text-gray-400'>
						{item.gender ? t('common.male') : t('common.female')} •{' '}
						{formatDate(item.dateOfBirth)}
					</p>
				</div>

				{/* Action Indicator */}
				<div className='mt-auto'>
					<div className='flex items-center justify-center gap-2 text-accent group-hover:text-main transition-colors'>
						<MoneySVG className='size-4' />
						<span className='text-sm font-medium'>
							{t('staff.view_payments')}
						</span>
					</div>
					<div className='w-full h-1 bg-gray-200 rounded-full mt-2 overflow-hidden'>
						<motion.div
							className='h-full bg-gradient-to-r from-main to-accent'
							initial={{ width: 0 }}
							animate={{ width: '100%' }}
							transition={{ duration: 0.5, delay: 0.2 }}
						/>
					</div>
				</div>
			</div>
		</motion.div>
	)
}

export default AccountItem
