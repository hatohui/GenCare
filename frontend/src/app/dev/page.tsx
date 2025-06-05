'use client'
import ItemCard from '@/Components/Management/ItemCard'
import SearchBar from '@/Components/Management/SearchBar'
import { NextSVG, PlusSVG, PreviousSVG } from '@/Components/SVGs'
import { ITEMS_PER_PAGE_COUNT } from '@/Constants/Management'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { debounce } from '@/Utils/debounce'
import clsx from 'clsx'
import { motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useMemo, useState } from 'react'

const accountsData: Account[] = [
	{
		id: 'a1',
		role: 'Admin',
		email: 'admin.jane@example.com',
		firstName: 'Jane',
		lastName: 'Doe',
		gender: false,
		phoneNumber: '123-456-7890',
		dateOfBirth: '1985-04-12',
		avatarUrl: 'https://example.com/avatars/jane.jpg',
	},
	{
		id: 'a2',
		role: 'Staff',
		email: 'john.smith@example.com',
		firstName: 'John',
		lastName: 'Smith',
		gender: true,
		phoneNumber: '987-654-3210',
		dateOfBirth: '1990-08-22',
	},
	{
		id: 'a3',
		role: 'Manager',
		email: 'sarah.connor@example.com',
		firstName: 'Sarah',
		lastName: 'Connor',
		gender: false,
		phoneNumber: '555-123-9876',
		dateOfBirth: '1982-12-02',
		avatarUrl: 'https://example.com/avatars/sarah.png',
		isDeleted: true,
		deletedAt: '2024-10-01',
		deletedBy: 'admin.jane@example.com',
	},
	{
		id: 'a4',
		role: 'Support',
		email: 'michael.bay@example.com',
		firstName: 'Michael',
		lastName: 'Bay',
		gender: true,
		phoneNumber: '321-987-6543',
		dateOfBirth: '1975-06-20',
	},
	{
		id: 'a5',
		role: 'User',
		email: 'amy.lee@example.com',
		firstName: 'Amy',
		lastName: 'Lee',
		gender: false,
		phoneNumber: '666-777-8888',
		dateOfBirth: '1995-03-15',
		isDeleted: false,
	},
	{
		id: 'a6',
		role: 'Staff',
		email: 'david.kim@example.com',
		firstName: 'David',
		lastName: 'Kim',
		gender: true,
		phoneNumber: '101-202-3030',
		dateOfBirth: '1987-09-18',
	},
	{
		id: 'a7',
		role: 'Admin',
		email: 'nina.williams@example.com',
		firstName: 'Nina',
		lastName: 'Williams',
		gender: false,
		phoneNumber: '202-303-4040',
		dateOfBirth: '1992-11-07',
		avatarUrl: 'https://example.com/avatars/nina.jpg',
	},
	{
		id: 'a8',
		role: 'Support',
		email: 'liam.nguyen@example.com',
		firstName: 'Liam',
		lastName: 'Nguyen',
		gender: true,
		phoneNumber: '303-404-5050',
		dateOfBirth: '1993-04-25',
		avatarUrl: 'https://example.com/avatars/liam.png',
	},
	{
		id: 'a9',
		role: 'User',
		email: 'olivia.brown@example.com',
		firstName: 'Olivia',
		lastName: 'Brown',
		gender: false,
		phoneNumber: '404-505-6060',
		dateOfBirth: '1996-01-10',
	},
	{
		id: 'a10',
		role: 'Manager',
		email: 'ethan.scott@example.com',
		firstName: 'Ethan',
		lastName: 'Scott',
		gender: true,
		phoneNumber: '505-606-7070',
		dateOfBirth: '1984-07-19',
	},
	{
		id: 'a11',
		role: 'Staff',
		email: 'mia.harris@example.com',
		firstName: 'Mia',
		lastName: 'Harris',
		gender: false,
		phoneNumber: '606-707-8080',
		dateOfBirth: '1991-02-28',
	},
	{
		id: 'a12',
		role: 'Admin',
		email: 'noah.green@example.com',
		firstName: 'Noah',
		lastName: 'Green',
		gender: true,
		phoneNumber: '707-808-9090',
		dateOfBirth: '1989-06-14',
	},
	{
		id: 'a13',
		role: 'User',
		email: 'ava.ward@example.com',
		firstName: 'Ava',
		lastName: 'Ward',
		gender: false,
		phoneNumber: '808-909-0000',
		dateOfBirth: '1997-08-23',
		isDeleted: true,
		deletedAt: '2025-03-11',
		deletedBy: 'noah.green@example.com',
	},
	{
		id: 'a14',
		role: 'Support',
		email: 'lucas.murphy@example.com',
		firstName: 'Lucas',
		lastName: 'Murphy',
		gender: true,
		phoneNumber: '909-000-1111',
		dateOfBirth: '1986-05-09',
	},
	{
		id: 'a15',
		role: 'Manager',
		email: 'isabella.cox@example.com',
		firstName: 'Isabella',
		lastName: 'Cox',
		gender: false,
		phoneNumber: '000-111-2222',
		dateOfBirth: '1983-12-30',
	},
]
const DevPage = () => {
	const [accounts, setAccounts] = useState(accountsData)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = ITEMS_PER_PAGE_COUNT
	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const search = searchParams.get('search')
	const [searchParam, setSearchParam] = useState(search)

	// maybe in far future
	// const [isTyping, setIsTyping] = useState(false)

	const createQueryString = useCallback(
		(name: string, value: string) => {
			const params = new URLSearchParams(searchParams.toString())
			params.set(name, value)
			return params.toString()
		},
		[searchParams]
	)

	console.log(setAccounts)

	const indexOfLastItem = currentPage * itemsPerPage
	const indexOfFirstItem = indexOfLastItem - itemsPerPage
	const currentAccounts = accounts.slice(indexOfFirstItem, indexOfLastItem)
	const totalPages = Math.ceil(accounts.length / itemsPerPage)

	const handleDelete = () => {
		alert('Account is getting deleted')
	}

	const debouncedPush = useMemo(
		() =>
			debounce((value: string) => {
				router.push(pathname + '?' + createQueryString('search', value))
			}, 1000),
		[router, pathname, createQueryString]
	)

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchParam(event.target.value)
		debouncedPush(event.target.value)
	}

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

			<div className='flex-1 overflow-y-auto md:px-4'>
				<div className='flex flex-col gap-3 py-2' role='list'>
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

export default DevPage
