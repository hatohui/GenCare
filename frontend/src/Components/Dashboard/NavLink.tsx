'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import { SideNavButtonProp } from '@/Constants/SideNav'
import { getNavOptionsFromRole } from '@/Utils/Permissions/getNavOptionsFromRole'
import { useAccountStore } from '@/Hooks/useAccount'
import { useState, useTransition } from 'react'
import LoadingIcon from '../LoadingIcon'

export default function NavLinks() {
	const { data } = useAccountStore()
	const pathname = usePathname()
	const router = useRouter()
	const [isPending, startTransition] = useTransition()
	const [activeLoadingLink, setActiveLoadingLink] = useState<string | null>(
		null
	)

	if (!data)
		return <div className='w-full text-center animate-pulse'>Loading...</div>

	const currentRoot = pathname.split('/')[1]
	const links = getNavOptionsFromRole(data.role.name, currentRoot)

	return (
		<>
			{links.map((link: SideNavButtonProp) => {
				const isActive = pathname === link.to
				const isLoading = isPending && activeLoadingLink === link.to

				const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
					if (isActive) {
						e.preventDefault()
						return
					}

					e.preventDefault()
					setActiveLoadingLink(link.to)
					startTransition(() => {
						router.push(link.to)
					})
				}

				return (
					<Link
						key={link.label}
						href={link.to}
						onClick={handleClick}
						aria-current={isActive ? 'page' : undefined}
						className={clsx(
							'flex justify-center rounded-sm items-center gap-2 grow transition truncate md:px-4 button md:flex-none text-slate-200 md:justify-start',
							{
								'bg-general text-slate-950 shadow-inner md:rounded-none md:border-r-8 md:border-accent':
									isActive,
								hoverable: !isActive && !isLoading,
								'opacity-70 pointer-events-none': isLoading,
							}
						)}
					>
						<span className='size-6'>
							{isLoading ? <LoadingIcon /> : link.svg}
						</span>
						<span className='show-pc-only'>{link.label}</span>
					</Link>
				)
			})}
		</>
	)
}
