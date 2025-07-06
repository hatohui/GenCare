'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { NavComponentProps } from '@/Interfaces/NavBar/Types/NavBarComponents'
import { useRouter } from 'next/navigation'
import { useLogoutAccount } from '@/Services/auth-service'
import useToken from '@/Hooks/Auth/useToken'
import { useAccountStore } from '@/Hooks/useAccount'
import { toast } from 'react-hot-toast'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { CldImage } from 'next-cloudinary'
import FallBackUserImage from '../Profile/FallBackUserImage'
import clsx from 'clsx'

const UserProfileDropdown = ({ className, onTop }: NavComponentProps) => {
	const [isOpen, setIsOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const tokenStore = useToken()
	const { data: user } = useAccountStore()
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleLogout = () => {
		logout(undefined, {
			onSuccess: () => {
				router.push('/login')
				toast.success('Logged out successfully')
				setIsOpen(false)
			},
			onError: () => {
				console.error('Logout failed')
				toast.error('Failed to logout')
			},
		})
	}

	const handleGoToApp = () => {
		const role = getRoleFromToken(tokenStore.accessToken!)
		if (role === 'member' || role === 'consultant') {
			router.push('/app')
		} else {
			router.push('/dashboard')
		}
		setIsOpen(false)
	}

	const handleToggleDropdown = () => {
		setIsOpen(!isOpen)
	}

	if (!tokenStore.accessToken || !user) {
		return (
			<button
				className={clsx(
					'rounded-full px-4 py-2 duration-200 cursor-pointer select-none text-center flex gap-2 items-center',
					className
				)}
				onClick={() => router.push('/login')}
			>
				<span className='pointer-events-none'>Đăng Nhập</span>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					fill='none'
					viewBox='0 0 24 24'
					strokeWidth={1.5}
					stroke='currentColor'
					className='size-6'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z'
					/>
				</svg>
			</button>
		)
	}

	return (
		<div ref={dropdownRef} className={clsx('relative', className)}>
			{/* Profile Button */}
			<button
				onClick={handleToggleDropdown}
				className={clsx(
					'flex items-center gap-3 px-3 py-2 rounded-full transition-all duration-200',
					'hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20',
					onTop ? 'text-white' : 'text-gray-800'
				)}
				aria-label='User profile menu'
				aria-expanded={isOpen}
			>
				{/* Avatar */}
				<div className='relative'>
					{user.avatarUrl ? (
						<CldImage
							src={user.avatarUrl}
							alt={`${user.firstName} ${user.lastName}`}
							width={32}
							height={32}
							className='rounded-full object-cover border-2 border-white/20'
						/>
					) : (
						<FallBackUserImage />
					)}
				</div>

				{/* User Info */}
				<div className='hidden md:flex flex-col items-start text-left'>
					<span className='text-sm font-medium truncate max-w-[120px]'>
						{user.firstName} {user.lastName}
					</span>
					<span className='text-xs opacity-75 truncate max-w-[120px]'>
						{user.email}
					</span>
				</div>

				{/* Dropdown Arrow */}
				<svg
					className={clsx(
						'size-4 transition-transform duration-200',
						isOpen && 'rotate-180'
					)}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M19 9l-7 7-7-7'
					/>
				</svg>
			</button>

			{/* Dropdown Menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, y: -10, scale: 0.95 }}
						animate={{ opacity: 1, y: 0, scale: 1 }}
						exit={{ opacity: 0, y: -10, scale: 0.95 }}
						transition={{ duration: 0.2, ease: 'easeOut' }}
						className='absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-[100]'
					>
						{/* User Info Section */}
						<div className='px-4 py-3 border-b border-gray-100'>
							<div className='flex items-center gap-3'>
								{user.avatarUrl ? (
									<CldImage
										src={user.avatarUrl}
										alt={`${user.firstName} ${user.lastName}`}
										width={40}
										height={40}
										className='rounded-full object-cover'
									/>
								) : (
									<FallBackUserImage />
								)}
								<div className='flex-1 min-w-0'>
									<p className='text-sm font-semibold text-gray-900 truncate'>
										{user.firstName} {user.lastName}
									</p>
									<p className='text-xs text-gray-500 truncate'>{user.email}</p>
									<p className='text-xs text-gray-400 capitalize'>
										{user.role?.name || 'User'}
									</p>
								</div>
							</div>
						</div>

						{/* Menu Items */}
						<div className='py-1'>
							<button
								onClick={handleGoToApp}
								className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150'
							>
								<svg
									className='size-4 text-gray-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z'
									/>
								</svg>
								Đi tới ứng dụng
							</button>

							<button
								onClick={() => {
									router.push('/app/profile')
									setIsOpen(false)
								}}
								className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-150'
							>
								<svg
									className='size-4 text-gray-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
									/>
								</svg>
								Hồ sơ cá nhân
							</button>

							<div className='border-t border-gray-100 my-1'></div>

							<button
								onClick={handleLogout}
								className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors duration-150'
							>
								<svg
									className='size-4 text-red-500'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'
									/>
								</svg>
								Đăng xuất
							</button>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	)
}

export default UserProfileDropdown
