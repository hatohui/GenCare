'use client'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'
import { Search } from 'lucide-react'
import CompactFloatingInput from '../Form/CompactFloatingInput'
import { useLocale } from '@/Hooks/useLocale'

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
	const search = searchParams?.get('search') || ''
	const [searchParam, setSearchParam] = useState<string>(search)
	const router = useRouter()
	const pathname = usePathname()
	const { t } = useLocale()

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParam(event.target.value)
		debouncedPush(event.target.value)
		onChange?.(event)
	}

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams?.toString() || '')
			if (value.trim()) {
				params.set(name, value.trim())
			} else {
				params.delete(name)
			}
			return params.toString()
		},
		[searchParams]
	)

	const debouncedPush = useMemo(
		() =>
			debounce((value: string) => {
				const queryString = createQueryString('search', value)
				const newPath = queryString ? `${pathname}?${queryString}` : pathname
				if (newPath) {
					router.push(newPath)
				}
			}, waitTime),
		[router, pathname, createQueryString, waitTime]
	)

	return (
		<div className={clsx('relative max-w-xs w-full', className)}>
			<CompactFloatingInput
				label={t('management.search')}
				type='text'
				id='search'
				value={searchParam ?? ''}
				onChange={handleSearch}
				aria-label='Search accounts'
				placeholder={t('management.search_placeholder')}
				className='drop-shadow-sm'
			/>
			{/* Search icon */}
			<div className='absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none'>
				<Search className='w-4 h-4 text-text' />
			</div>
		</div>
	)
}

export default SearchBar
