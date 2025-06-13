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
		<FloatingLabelInput
			label='search'
			type='text'
			id='search'
			value={searchParam ?? ''}
			className={clsx(
				className ? className : '',
				'min-h-[2rem] grow bg-main/10 border-2 text-slate-800 focus:border-accent focus:border-2 font-light rounded-sm p-2 ring-0 focus:ring-0 outline-none'
			)}
			onChange={handleSearch}
			aria-label='Search bar'
		/>
	)
}

export default SearchBar
