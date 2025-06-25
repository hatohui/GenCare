import React, { useEffect, useState } from 'react'
import NavLinks from './NavLink'
import Logo from '../Logo'
import UserProfile from './UserProfile'

export default function SideNav() {
	const [collapsed, setCollapsed] = useState(false)
	const [isHovering, setIsHovering] = useState(false)

	// 👉 Force expanded on mobile
	const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
	const isExpanded = !collapsed || isHovering || isMobile

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth < 768) {
				setCollapsed(false)
			}
		}
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	return (
		<div className='relative overflow-visible'>
			{/* ✅ Only show collapse toggle on md+ */}
			<button
				aria-label='side-bar-toggle'
				className='absolute top-1/2 -translate-y-1/2 right-[-16px] z-20 rounded-full bg-accent text-white w-8 h-8 flex items-center justify-center shadow-lg hover:scale-105 transition hidden md:flex'
				onClick={() => setCollapsed(!collapsed)}
			>
				{collapsed ? '→' : '←'}
			</button>

			<div
				onMouseEnter={() => setIsHovering(true)}
				onMouseLeave={() => setIsHovering(false)}
				className={`flex h-full flex-col text-white py-1 md:py-5 transition-all duration-300 ${
					isExpanded ? 'w-full md:w-60' : 'w-full md:w-14'
				} main-gradient-bg`}
			>
				{/* Logo */}
				<div className='center-all py-5 pb-10'>
					<Logo className='h-full w-full flex-1' withLabel={isExpanded} />
				</div>

				<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
					<NavLinks collapsed={!isExpanded} />

					<div className='center-all'>
						<div className='h-[2px] round bg-gray-300 w-11/12' />
					</div>

					<div className='hidden w-full grow md:block' />

					<UserProfile collapsed={!isExpanded} />
				</div>
			</div>
		</div>
	)
}
