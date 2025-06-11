'use client'

import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'

const SearchBar = ({
	waitTime = 1000,
	className = '',
}: {
	waitTime?: number
	className?: string
}) => {
	const searchParams = useSearchParams()
	const search = searchParams.get('search')
	const [searchParam, setSearchParam] = useState(search)
	const router = useRouter()
	const pathname = usePathname()

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParam(event.target.value)
		debouncedPush(event.target.value)
	}

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	const debouncedPush = useMemo(
		() =>
			debounce((value: string) => {
				router.push(pathname + '?' + createQueryString('search', value))
			}, waitTime),
		[router, pathname, createQueryString, waitTime]
	)

	return (
		<motion.input
			type='text'
			id='search'
			placeholder='Search...'
			value={searchParam ?? ''}
			className={clsx(
				className,
				'min-h-[2rem] grow bg-main/10 border-2 text-slate-800 font-light rounded-sm p-2 ring-0 focus:ring-0 outline-none'
			)}
			onChange={handleSearch}
			autoComplete='off'
			tabIndex={0}
			whileFocus={{ borderColor: 'var(--color-accent)', borderWidth: '2px' }}
			aria-label='Search bar'
		/>
	)
}

export default SearchBar
