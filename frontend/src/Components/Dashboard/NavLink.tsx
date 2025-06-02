'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import { SIDE_NAV_OPTIONS as links } from '@/Constants/SideNav'

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
interface NavLink {
	label: string
	to: string
}

export default function NavLinks() {
	const pathname = usePathname()
	return (
		<>
			{links.map((link: NavLink) => {
				return (
					<Link
						key={link.label}
						href={link.to}
						aria-current={pathname === link.to ? 'page' : undefined}
						className={clsx(
							'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-accent md:flex-none md:justify-start md:p-2 md:px-3',
							{
								'bg-sky-100 text-accent': pathname === link.to,
							}
						)}
					>
						<span className='md:block'>{link.label}</span>
					</Link>
				)
			})}
		</>
	)
}
