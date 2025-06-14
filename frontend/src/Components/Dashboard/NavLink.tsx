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
							'flex justify-center rounded-sm items-center gap-2 grow transition truncate md:px-4 button md:flex-none text-slate-200 md:justify-start',
							{
								'bg-general text-slate-950 shadow-inner md:rounded-none md:border-r-8 md:border-accent':
									pathname === link.to,
							},
							{ hoverable: pathname !== link.to }
						)}
					>
						<span className='size-6'>{link.svg}</span>
						<span className='show-pc-only'>{link.label}</span>
					</Link>
				)
			})}
		</>
	)
}
