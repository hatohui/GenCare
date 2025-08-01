'use client'
import Button from '@/Components/Button'
import Pagination from '@/Components/Management/Pagination'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useGetConsultants } from '@/Services/account-service'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { useConsultantStore } from '@/Components/Consultant/ConsultantContext'
import { PaginationContext } from './layout'
import { CldImage } from 'next-cloudinary'
import { useLocale } from '@/Hooks/useLocale'

const PAGE_SIZE = 8

const ConsultantList = () => {
	const { page, setPage } = React.useContext(PaginationContext)
	const router = useRouter()
	const searchParams = useSearchParams()
	const searchTerm = searchParams?.get('search') ?? ''
	const setConsultants = useConsultantStore(state => state.setConsultants)
	const { t } = useLocale()

	// Check for reduced motion preference
	const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

	React.useEffect(() => {
		const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
		setPrefersReducedMotion(mediaQuery.matches)

		const handleChange = (e: MediaQueryListEvent) => {
			setPrefersReducedMotion(e.matches)
		}

		mediaQuery.addEventListener('change', handleChange)
		return () => mediaQuery.removeEventListener('change', handleChange)
	}, [])

	const { data, isLoading, error } = useGetConsultants(
		PAGE_SIZE ?? 0,
		page,
		searchTerm || null
	)
	const totalPages = data ? Math.ceil(data.totalCount / PAGE_SIZE) : 1

	const handleConsultantClick = (consultant: Consultant) => {
		router.push(`/app/consultants/${consultant.id}`)
	}

	React.useEffect(() => {
		if (data?.consultants) setConsultants(data.consultants)
	}, [data, setConsultants])

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[300px] sm:min-h-[400px]'>
				<LoadingIcon />
			</div>
		)
	}

	if (error) {
		return (
			<div className='text-center py-4 sm:py-8 px-4'>
				<p className='text-red-600 mb-4 text-sm sm:text-base'>
					{t('consultant.failed_to_load')}
				</p>
				<Button
					label={t('common.try_again')}
					onClick={() => window.location.reload()}
				/>
			</div>
		)
	}

	if (!data || data.consultants.length === 0) {
		return (
			<div className='text-center py-4 sm:py-8 px-4'>
				<p className='text-gray-600 mb-4 text-sm sm:text-base'>
					{searchTerm
						? t('consultant.no_consultants_found_search')
						: t('consultant.no_consultants_available')}
				</p>
			</div>
		)
	}

	return (
		<>
			{/* Results Info */}
			{data && (
				<div className='px-3 sm:px-6 pb-2 sm:pb-4'>
					<p className='text-xs sm:text-sm text-gray-600'>
						{t('consultant.showing_results', {
							start: (page - 1) * PAGE_SIZE + 1,
							end: Math.min(page * PAGE_SIZE, data.totalCount),
							total: data.totalCount,
						})}
					</p>
				</div>
			)}

			<motion.div
				className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 p-3 sm:p-4 lg:p-6'
				key={page}
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{
					duration: 0.4,
					type: 'spring',
					stiffness: 100,
					damping: 15,
				}}
			>
				{data.consultants.map((consultant, idx) => {
					const fullName =
						`${consultant.firstName ?? ''} ${
							consultant.lastName ?? ''
						}`.trim() ?? 'N/A'
					const initials =
						fullName !== 'N/A'
							? fullName
									.split(' ')
									.map(n => n[0])
									.join('')
									.toUpperCase()
							: 'N/A'

					return (
						<motion.div
							key={`${consultant.id}-${page}`}
							initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
							animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
							transition={{
								duration: 0.6,
								type: 'spring',
								stiffness: 100,
								damping: 15,
								delay: idx * 0.1,
							}}
							whileHover={{
								scale: 1.05,
								y: -8,
								rotateY: 5,
								boxShadow:
									'0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(6, 125, 173, 0.1)',
								transition: { duration: 0.3, type: 'spring', stiffness: 300 },
							}}
							whileTap={{
								scale: 0.98,
								transition: { duration: 0.1 },
							}}
							className='bg-white border border-main/20 rounded-xl sm:rounded-2xl shadow-sm flex flex-col items-center justify-between p-3 sm:p-4 text-center h-full min-h-[280px] sm:min-h-[300px] w-full cursor-pointer relative overflow-hidden group'
							onClick={() => handleConsultantClick(consultant)}
						>
							{/* Animated background gradient */}
							<motion.div
								className='absolute inset-0 bg-gradient-to-br from-main/10 via-white to-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500'
								initial={{ opacity: 0 }}
								whileHover={{ opacity: 1 }}
							/>

							<div className='flex flex-col items-center flex-1 relative z-10'>
								<motion.div
									whileHover={{
										scale: 1.1,
										transition: { duration: 0.6, type: 'spring' },
									}}
								>
									{consultant.avatarUrl ? (
										<CldImage
											src={consultant.avatarUrl}
											alt={fullName}
											width={80}
											height={80}
											className='w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 sm:border-4 border-main/30 mb-2 shadow-lg'
										/>
									) : (
										<div className='w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-main to-secondary border-2 sm:border-4 border-main/30 mb-2 flex items-center justify-center text-white font-semibold text-sm sm:text-base shadow-lg'>
											{initials}
										</div>
									)}
								</motion.div>

								<motion.h2
									className='text-sm sm:text-base font-semibold text-secondary mb-1'
									whileHover={{
										scale: 1.05,
										color: '#067dad',
										transition: { duration: 0.2 },
									}}
								>
									{fullName}
								</motion.h2>

								<motion.span
									className='text-xs text-white bg-gradient-to-r from-main to-secondary px-3 py-1 rounded-full shadow-md'
									whileHover={{
										scale: 1.1,
										boxShadow: '0 4px 12px rgba(6, 125, 173, 0.4)',
										transition: { duration: 0.2 },
									}}
								>
									{consultant.department}
								</motion.span>

								<motion.p
									className='text-xs text-gray-600 mt-2 h-12 max-h-12 line-clamp-2 px-1'
									whileHover={{
										color: '#374151',
										transition: { duration: 0.2 },
									}}
								>
									{consultant.biography ??
										`${consultant.degree} with ${consultant.yearOfExperience} years of experience`}
								</motion.p>
							</div>

							<div className='flex items-center justify-between mt-2 w-full gap-2 relative z-10'>
								<motion.span
									className='text-xs text-accent font-medium flex-shrink-0 flex items-center gap-1'
									whileHover={{
										scale: 1.1,
										color: '#fe6b6a',
										transition: { duration: 0.2 },
									}}
								>
									<motion.span
										animate={{ rotate: [0, 10, -10, 0] }}
										transition={{
											duration: 2,
											repeat: Infinity,
											repeatDelay: 3,
										}}
									>
										⭐
									</motion.span>
									{consultant.yearOfExperience}+ years
								</motion.span>

								<motion.div
									whileHover={{
										scale: 1.05,
										transition: { duration: 0.2 },
									}}
									whileTap={{ scale: 0.95 }}
								>
									<Button
										label='Book Consultant'
										labelMobile='Book'
										onClick={() => handleConsultantClick(consultant)}
										className='text-xs px-2 py-1 flex-shrink-0'
									/>
								</motion.div>
							</div>
						</motion.div>
					)
				})}
				{page === totalPages && (
					<motion.div
						key={`coming-soon-${page}`}
						initial={{ opacity: 0, y: 50, scale: 0.8, rotateX: -15 }}
						animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
						transition={{
							duration: 0.6,
							type: 'spring',
							stiffness: 100,
							damping: 15,
							delay: data.consultants.length * 0.1,
						}}
						whileHover={{
							scale: 1.05,
							y: -8,
							rotateY: 5,
							boxShadow:
								'0 20px 40px rgba(0,0,0,0.15), 0 0 0 1px rgba(6, 125, 173, 0.1)',
							transition: { duration: 0.3, type: 'spring', stiffness: 300 },
						}}
						className='bg-gradient-to-br from-main/5 via-white to-secondary/5 border border-main/20 rounded-xl sm:rounded-2xl shadow-sm flex flex-col items-center justify-center p-4 sm:p-6 text-center h-full min-h-[280px] sm:min-h-[320px] w-full relative overflow-hidden group'
					>
						{/* Reduced animated background particles */}
						{!prefersReducedMotion && (
							<motion.div
								className='absolute inset-0 pointer-events-none'
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								transition={{ duration: 1, delay: 0.5 }}
							>
								{[...Array(3)].map((_, i) => (
									<motion.div
										key={i}
										className='absolute w-3 h-3 bg-gradient-to-r from-main/60 to-secondary/60 rounded-full'
										style={{
											left: `${15 + i * 25}%`,
											top: `${20 + i * 20}%`,
											willChange: 'transform, opacity',
										}}
										animate={{
											y: [0, -15, 0],
											x: [0, 8, 0],
											opacity: [0.2, 0.6, 0.2],
											scale: [1, 1.3, 1],
										}}
										transition={{
											duration: 4 + i * 0.5,
											repeat: Infinity,
											delay: i * 0.5,
										}}
									/>
								))}
							</motion.div>
						)}

						<div className='relative z-10'>
							<motion.div
								className='w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-main to-secondary flex items-center justify-center text-white text-2xl sm:text-3xl font-bold mb-3 sm:mb-4 shadow-lg'
								animate={
									prefersReducedMotion
										? {}
										: {
												scale: [1, 1.05, 1],
										  }
								}
								transition={
									prefersReducedMotion
										? {}
										: {
												duration: 3,
												repeat: Infinity,
												repeatType: 'reverse',
										  }
								}
								whileHover={{
									scale: 1.1,
									rotate: prefersReducedMotion ? 0 : 360,
									transition: { duration: 0.6, type: 'spring' },
								}}
							>
								<motion.span
									animate={
										prefersReducedMotion
											? {}
											: {
													scale: [1, 1.1, 1],
													opacity: [0.9, 1, 0.9],
											  }
									}
									transition={
										prefersReducedMotion
											? {}
											: {
													duration: 2,
													repeat: Infinity,
											  }
									}
								>
									+
								</motion.span>
							</motion.div>

							<motion.h2
								className='text-base sm:text-lg font-semibold mb-2'
								style={{
									background: 'linear-gradient(90deg, #067dad, #038474)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent',
									backgroundClip: 'text',
									color: '#067dad',
								}}
								whileHover={
									prefersReducedMotion
										? {
												scale: 1.02,
												transition: { duration: 0.2 },
										  }
										: {
												scale: 1.05,
												backgroundPosition: ['0% 50%', '100% 50%'],
												transition: { duration: 0.3 },
										  }
								}
							>
								New Consultant Coming Soon
							</motion.h2>

							<motion.p
								className='text-xs sm:text-sm text-gray-500 mt-2 px-2'
								whileHover={{
									color: '#374151',
									transition: { duration: 0.2 },
								}}
							>
								We&apos;re expanding our team of healthcare professionals. Stay
								tuned for our new consultant!
							</motion.p>

							{/* Reduced animated sparkles */}
							{!prefersReducedMotion && (
								<motion.div
									className='absolute inset-0 pointer-events-none'
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ duration: 1, delay: 1 }}
								>
									{[...Array(4)].map((_, i) => (
										<motion.div
											key={i}
											className='absolute w-1 h-1 bg-accent rounded-full'
											style={{
												left: `${15 + i * 20}%`,
												top: `${35 + i * 15}%`,
												willChange: 'transform, opacity',
											}}
											animate={{
												y: [0, -10, 0],
												opacity: [0, 0.8, 0],
												scale: [0, 1, 0],
											}}
											transition={{
												duration: 3,
												repeat: Infinity,
												delay: i * 0.5,
											}}
										/>
									))}
								</motion.div>
							)}
						</div>
					</motion.div>
				)}
			</motion.div>
			<div className='center-all w-full px-3 sm:px-6'>
				<Pagination
					currentPage={page}
					isFetching={isLoading}
					setCurrentPage={setPage}
					totalCount={data.totalCount}
					itemsPerPage={PAGE_SIZE}
				/>
			</div>
		</>
	)
}

export default ConsultantList
