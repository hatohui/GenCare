'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
	SIDE_NAV_OPTIONS as links,
	SideNavButtonProp,
} from '@/Constants/SideNav'

export default function NavLinks() {
	const pathname = usePathname()
	return (
		<>
			{links.map((link: SideNavButtonProp) => {
				return (
					<Link
						key={link.label}
						href={link.to}
						aria-current={pathname === link.to ? 'page' : undefined}
						className={clsx(
							'flex h-[48px] min-x-[48px] grow truncate items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-lg font-semibold hover:bg-sky-100 hover:text-accent md:flex-none md:justify-start md:p-2 md:px-3',
							{
								'bg-sky-100 text-accent': pathname === link.to,
							}
						)}
					>
						<span className='hidden md:block'>{link.label}</span>
						<span className='block md:hidden'>{link.svg}</span>
					</Link>
				)
			})}
		</>
	)
}
