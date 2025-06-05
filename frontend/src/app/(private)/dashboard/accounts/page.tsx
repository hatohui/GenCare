'use client'
import LoadingPage from '@/Components/Loading'
import ItemCard from '@/Components/Management/ItemCard'
import ItemCardHeader from '@/Components/Management/ItemCardHeader'
import SearchBar from '@/Components/Management/SearchBar'
import { NextSVG, PlusSVG, PreviousSVG } from '@/Components/SVGs'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { useGetAccountsByPage } from '@/Services/account-service'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useMemo, useState } from 'react'

const AccountPage = () => {
	const [accounts, setAccounts] = useState<Account[]>([])
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const search = searchParams.get('search')
	const [searchParam, setSearchParam] = useState(search)
	const getAccountQuery = useGetAccountsByPage(itemsPerPage, currentPage)
	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem)
	const totalPages = Math.ceil(accounts.length / itemsPerPage)

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	//query
	useEffect(() => {
		console.log('RESULT: ', getAccountQuery.data)
		if (getAccountQuery.data) setAccounts(getAccountQuery.data.accounts)
	}, [currentPage, pathname, search])

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

	if (getAccountQuery.isLoading) return <LoadingPage />

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

			<ItemCardHeader
				label='Họ và Tên'
				secondaryLabel='Email'
				thirdLabel='Ngày sinh'
				fourthLabel='Tác vụ'
			/>

			<div className='flex-1 overflow-y-auto'>
				<div className='flex flex-col gap-3 px-2 py-1' role='list'>
					{currentAccounts.map(account => (
						<ItemCard
							id={account.id}
							key={account.id}
							label={`${account.firstName} ${account.lastName}`}
							secondaryLabel={account.email}
							status={account.isDeleted ? 'FAILED' : 'SUCCESS'}
							date={account.dateOfBirth}
							path='/account/'
							handleDelete={handleDelete}
						/>
					))}
				</div>
			</div>

			<nav aria-label='Pagination' className='flex justify-center mx-6 gap-4'>
				<button>
					<PreviousSVG />
				</button>
				<div className='flex gap-2'>
					{Array.from({ length: totalPages }, (_, i) => i + 1).map(
						pageNumber => (
							<motion.button
								key={pageNumber}
								id={`no_${pageNumber}`}
								onClick={() => setCurrentPage(pageNumber)}
								className={`px-3 duration-200 border rounded-sm ${
									currentPage === pageNumber ? 'text-accent' : 'text-slate-950'
								}`}
								aria-label={`Page ${pageNumber}`}
								aria-current={currentPage === pageNumber ? 'page' : undefined}
								whileHover={{
									backgroundColor: 'var(--color-accent)',
									color: 'white',
								}}
								transition={{
									duration: 0.2,
									type: 'spring',
									ease: 'easeIn',
								}}
							>
								{pageNumber}
							</motion.button>
						)
					)}
				</div>
				<button>
					<NextSVG />
				</button>
			</nav>
		</section>
	)
}

export default AccountPage
