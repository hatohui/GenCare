import React from 'react'
import Sidenav from '@/Components/Dashboard/Sidenav'

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='flex flex-col md:flex-row md:overflow-hidden h-screen florageBackground'>
			<div className='w-full flex-none md:w-64'>
				<Sidenav />
			</div>
			<main className='flex-1 p-7 h-full scroll-smooth'>{children}</main>
		</div>
	)
}
