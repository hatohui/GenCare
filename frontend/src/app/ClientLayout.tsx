'use client'

import NavBar from '@/Components/NavBar'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()

	//hide navbar on specific paths
	const hideNavbarPaths = ['/login', '/register']
	const shouldHideNavbar = hideNavbarPaths.includes(pathname)

	return (
		<>
			{!shouldHideNavbar && <NavBar />}
			{children}
		</>
	)
}
