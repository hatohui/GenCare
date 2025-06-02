'use client'

import Link from 'next/link'
import NavLinks from './NavLink'
import { useRouter } from 'next/navigation'
import { clearAccessToken } from '@/Utils/clearAccessToken'

export default function SideNav() {
	const router = useRouter()
	const handleLogout = () => {
		clearAccessToken()
		router.push('/login')
	}
	return (
		<div className='flex h-full flex-col px-4 py-4 md:px-2'>
			<Link
				className='mb-2 flex h-20 items-end justify-start rounded-md bg-main p-4 md:h-40'
				href='/'
			>
				<div className='w-32 text-white md:w-40'>Logo here</div>
			</Link>
			<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
				<NavLinks />
				<div className='hidden h-auto w-full grow rounded-md bg-gray-50 md:block'></div>
				<form>
					<button
						onClick={handleLogout}
						className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
					>
						<div className='hidden md:block'>Sign Out</div>
					</button>
				</form>
			</div>
		</div>
	)
}
