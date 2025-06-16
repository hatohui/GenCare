'use client'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useState, useMemo, useCallback } from 'react'
import FloatingLabelInput from '../Form/FloatingLabel'

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
		const trimmedValue = event.target.value.trim()

		setSearchParam(trimmedValue)
		debouncedPush(trimmedValue)
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
		<FloatingLabelInput
			label='search'
			type='text'
			id='search'
			value={searchParam ?? ''}
			className={clsx(className ? className : '', 'font-light')}
			onChange={handleSearch}
			aria-label='Search bar'
		/>
	)
}

export default SearchBar
