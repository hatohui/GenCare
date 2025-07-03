'use client'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'
import CompactFloatingInput from '../Form/CompactFloatingInput'

interface SearchBarProps {
	className?: string
	waitTime?: number
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const SearchBar = ({
	waitTime = 500,
	className = '',
	onChange,
}: SearchBarProps) => {
	const searchParams = useSearchParams()
	const search = searchParams?.get('search')
	const [searchParam, setSearchParam] = useState(search)
	const router = useRouter()
	const pathname = usePathname()

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParam(event.target.value)
		debouncedPush(event.target.value)
		onChange?.(event)
	}

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams?.toString())
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	const debouncedPush = useMemo(
		() =>
			debounce((value: string) => {
				router.push(pathname + '?' + createQueryString('search', value.trim()))
			}, waitTime),
		[router, pathname, createQueryString, waitTime]
	)

	return (
		<div className={clsx('relative max-w-xs w-full', className)}>
			<CompactFloatingInput
				label='Tìm kiếm'
				type='text'
				id='search'
				value={searchParam ?? ''}
				onChange={handleSearch}
				aria-label='Search accounts'
				placeholder='Nhập từ khóa...'
				className='drop-shadow-sm'
			/>
			{/* Search icon */}
			<div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
				<svg
					className='w-4 h-4 text-text'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
					/>
				</svg>
			</div>
		</div>
	)
}

export default SearchBar
