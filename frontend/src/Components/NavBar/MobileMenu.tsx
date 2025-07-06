import { NAV_OPTIONS } from '@/Constants/NavBar'
import { AnimatePresence, motion } from 'motion/react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import useToken from '@/Hooks/Auth/useToken'
import { useAccountStore } from '@/Hooks/useAccount'
import { useLogoutAccount } from '@/Services/auth-service'
import { toast } from 'react-hot-toast'
import { getRoleFromToken } from '@/Utils/Auth/getRoleFromToken'
import { CldImage } from 'next-cloudinary'
import FallBackUserImage from '../Profile/FallBackUserImage'

export type MobileMenu = {
	isOpened: boolean
	setOpened: React.Dispatch<React.SetStateAction<boolean>>
}

const MobileMenu = ({ isOpened, setOpened }: MobileMenu) => {
	const path = usePathname()
	const tokenStore = useToken()
	const { data: user } = useAccountStore()
	const router = useRouter()
	const { mutate: logout } = useLogoutAccount()
	const [showUserMenu, setShowUserMenu] = useState(false)

	const handleLogout = () => {
		logout(undefined, {
			onSuccess: () => {
				router.push('/login')
				toast.success('Logged out successfully')
				setOpened(false)
				setShowUserMenu(false)
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
		setOpened(false)
		setShowUserMenu(false)
	}

	return (
		<AnimatePresence>
			{isOpened && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -10 }}
					className='md:hidden flex flex-col overflow-hidden fixed top-0 left-0 w-screen h-screen bg-white/5 backdrop-blur-lg shadow-lg z-50'
					id='mobile-menu'
				>
					<div
						className='absolute right-6 top-4'
						onClick={() => setOpened(!isOpened)}
						onTouchEnd={() => setOpened(!isOpened)}
						aria-expanded={isOpened}
						aria-label={isOpened ? 'Close menu' : 'Open menu'}
						aria-controls='mobile-menu'
					>
						<motion.svg
							xmlns='http://www.w3.org/2000/svg'
							fill='none'
							viewBox='0 0 26 26'
							strokeWidth={1.5}
							stroke='var(--color-main)'
							className='size-8'
							initial='hide'
							animate={isOpened ? 'hide' : 'show'}
							variants={{
								hide: { opacity: 1, zIndex: 50 },
								show: { opacity: 0 },
							}}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M6 18 18 6M6 6l12 12'
							/>
						</motion.svg>
					</div>
					<div className='h-[10%] w-full'></div>
					<nav className='w-full text-center'>
						{NAV_OPTIONS.map((button, index) => (
							<Link
								key={index}
								href={button.to}
								onClick={() => setOpened(!isOpened)}
								className={`block px-4 py-2 text-gray-800 transition-colors ${
									button.to === path
										? 'bg-gray-700 text-white pointer-events-none'
										: 'hover:bg-gray-100'
								}`}
							>
								{button.label}
							</Link>
						))}

						{/* User Profile Section */}
						{tokenStore.accessToken && user ? (
							<div className='border-t border-gray-200 mt-4 pt-4'>
								{/* User Info */}
								<div className='flex items-center justify-center gap-3 px-4 py-3 mb-2'>
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
									<div className='text-left'>
										<p className='text-sm font-semibold text-gray-900'>
											{user.firstName} {user.lastName}
										</p>
										<p className='text-xs text-gray-500'>{user.email}</p>
									</div>
								</div>

								{/* User Menu */}
								<button
									onClick={() => setShowUserMenu(!showUserMenu)}
									className='w-full px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2'
								>
									<span>Menu</span>
									<svg
										className={`size-4 transition-transform duration-200 ${
											showUserMenu ? 'rotate-180' : ''
										}`}
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

								<AnimatePresence>
									{showUserMenu && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: 'auto' }}
											exit={{ opacity: 0, height: 0 }}
											transition={{ duration: 0.2 }}
											className='overflow-hidden'
										>
											<button
												onClick={handleGoToApp}
												className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3'
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
													setOpened(false)
													setShowUserMenu(false)
												}}
												className='w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3'
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

											<button
												onClick={handleLogout}
												className='w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3'
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
										</motion.div>
									)}
								</AnimatePresence>
							</div>
						) : (
							<Link href='/login' className='block px-4 py-2 text-accent'>
								Đăng Nhập
							</Link>
						)}
					</nav>
					<div className='h-[10%] w-full'></div>
				</motion.div>
			)}
		</AnimatePresence>
	)
}

export default MobileMenu
