'use client'
import AccountList from '@/Components/Management/AccountList'
import Pagination from '@/Components/Management/Pagination'
import SearchBar from '@/Components/Management/SearchBar'
import { PlusSVG } from '@/Components/SVGs'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { useGetAccountsByPage } from '@/Services/account-service'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'

const AccountPage = () => {
	const [currentPage, setCurrentPage] = useState<number>(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const search = searchParams.get('search')
	const [searchParam, setSearchParam] = useState(search)

	const { isLoading, isError, isFetching, data } = useGetAccountsByPage(
		itemsPerPage,
		currentPage ? currentPage : 1
	)

	const totalPages = 5

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	//delete
	const handleDelete = () => {
		alert('Account is getting deleted')
	}

	//debounce query search
	const debouncedPush = useMemo(
		() =>
			debounce((value: string) => {
				router.push(pathname + '?' + createQueryString('search', value))
			}, 1000),
		[router, pathname, createQueryString]
	)

	//handle search
	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParam(event.target.value)
		debouncedPush(event.target.value)
	}

	if (isError)
		return <div className='h-full center-all w-full text-red-500'>Error.</div>

	return (
		<section
			className={clsx('flex h-full flex-col gap-4 md:gap-5')}
			aria-label='Account Management'
		>
			<div className='w-full flex gap-3 px-1'>
				<div className='w-full'>
					<h1 className='text-2xl font-bold'>Search</h1>
					<div className='flex gap-3 grow overflow-scroll'>
						<SearchBar
							value={searchParam ?? ''}
							handleSearch={handleSearch}
							aria-label='Search accounts'
						/>
						<motion.button
							className='rounded-[30px] z-50 drop-shadow-smt cursor-pointer flex center-all gap-2 border px-3'
							tabIndex={0}
							whileHover={{
								backgroundColor: 'var(--color-accent)',
								color: 'var(--color-general)',
							}}
							transition={{ duration: 0.2 }}
						>
							<span className='pointer-events-none'>
								<PlusSVG />
							</span>
							<span className='whitespace-nowrap pointer-events-none hidden md:block'>
								Add
							</span>
						</motion.button>
					</div>
				</div>
			</div>

			{!data || isLoading || isFetching ? (
				<div className='h-full center-all w-full animate-pulse'>
					Fetching data...
				</div>
			) : (
				<AccountList data={data} handleDelete={handleDelete} />
			)}

			<Pagination
				currentPage={currentPage}
				isFetching={isFetching}
				setCurrentPage={setCurrentPage}
				totalPages={totalPages}
			/>
		</section>
	)
}

export default AccountPage
