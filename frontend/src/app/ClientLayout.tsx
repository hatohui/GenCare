'use client'

import NavBar from '@/Components/NavBar/NavBar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	const hideNavbarPaths = ['/login', '/register']
	const shouldHideNavbar = hideNavbarPaths.includes(pathname)

	return (
		<>
			{!shouldHideNavbar && <NavBar />}
			{shouldHideNavbar && (
				<Link
					href='/'
					className='fixed top-4 left-4 z-50 text-white bg-main hover:bg-accent px-4 py-2 rounded-full  transition-all duration-200'
				>
					<span>&lt;</span> Back to Home
				</Link>
			)}
			{children}
		</>
	)
}
