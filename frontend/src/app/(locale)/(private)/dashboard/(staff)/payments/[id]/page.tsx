'use client'

import SearchBar from '@/Components/Management/SearchBar'
import PurchaseList from '@/Components/staff/PurchaseList'
import { motion } from 'motion/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import React, { use, useEffect } from 'react'
import { ArrowLeftSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const sort = searchParams?.get('isPaid') || ''
		const search = searchParams?.get('search') || ''
	}, [searchParams])

	if (!id) {
		router.push('/dashboard/payments')
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<LoadingIcon className='size-8' />
			</div>
		)
	}

	const currentFilter = searchParams?.get('isPaid')

	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='mb-8'
			>
				<div className='flex items-center gap-4 mb-4'>
					<button
						onClick={() => router.push('/dashboard/payments')}
						className='p-2 rounded-full hover:bg-gray-100 transition-colors'
						aria-label='Quay lại'
					>
						<ArrowLeftSVG className='size-6 text-gray-600' />
					</button>
					<div>
						<h1 className='text-3xl font-bold text-main'>
							Chi Tiết Thanh Toán
						</h1>
						<p className='text-gray-600'>Quản lý giao dịch của khách hàng</p>
					</div>
				</div>
			</motion.div>

			{/* Search and Filters */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-8 space-y-4'
			>
				{/* Search Bar */}
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'>
					<SearchBar className='w-full' waitTime={1000} />
				</div>

				{/* Filter Buttons */}
				<div className='flex items-center gap-3 flex-wrap'>
					<button
						className={`px-6 py-3 rounded-[20px] font-medium transition-all ${
							currentFilter === null
								? 'bg-main text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => {
							const params = new URLSearchParams(
								searchParams ? searchParams : ''
							)
							params.delete('isPaid')
							router.push(`${pathname}?${params.toString()}`)
						}}
					>
						Tất cả
					</button>
					<button
						className={`px-6 py-3 rounded-[20px] font-medium transition-all ${
							currentFilter === 'true'
								? 'bg-green-600 text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => {
							const params = new URLSearchParams(
								searchParams ? searchParams : ''
							)
							params.set('isPaid', 'true')
							router.push(`${pathname}?${params.toString()}`)
						}}
					>
						Đã thanh toán
					</button>
					<button
						className={`px-6 py-3 rounded-[20px] font-medium transition-all ${
							currentFilter === 'false'
								? 'bg-yellow-600 text-white shadow-md'
								: 'bg-gray-100 text-gray-700 hover:bg-gray-200'
						}`}
						onClick={() => {
							const params = new URLSearchParams(
								searchParams ? searchParams : ''
							)
							params.set('isPaid', 'false')
							router.push(`${pathname}?${params.toString()}`)
						}}
					>
						Chưa thanh toán
					</button>
				</div>
			</motion.div>

			{/* Purchase List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<PurchaseList id={id} />
			</motion.div>
		</div>
	)
}

export default Page
