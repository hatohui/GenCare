'use client'

import React, { useEffect, useState } from 'react'
import { useViewPurchaseById } from '@/Services/book-service'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import PurchaseItem from './PurchaseItem'
import LoadingIcon from '../LoadingIcon'
import { MoneySVG } from '../SVGs'

interface PurchaseListProps {
	id: string
}

const PurchaseList = ({ id }: PurchaseListProps) => {
	const searchParams = useSearchParams()
	const [search, setSearch] = useState<string>('')
	const [isPaid, setIsPaid] = useState<boolean | null>(null)

	const { data, error, isFetching } = useViewPurchaseById(id, search, isPaid)

	useEffect(() => {
		setSearch(searchParams?.get('search') || '')
		const isPaidParam = searchParams?.get('isPaid')
		setIsPaid(isPaidParam === null ? null : isPaidParam === 'true')
	}, [searchParams])

	// Loading state
	if (isFetching && !data) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4 size-8' />
					<p className='text-gray-600'>Đang tải danh sách giao dịch...</p>
				</div>
			</div>
		)
	}

	// Error state
	if (error) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không thể tải danh sách
					</h3>
					<p className='text-gray-600 mb-4'>
						Đã xảy ra lỗi khi tải danh sách giao dịch. Vui lòng thử lại sau.
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						Thử lại
					</button>
				</div>
			</div>
		)
	}

	// Empty state
	if (!data || data.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-gray-400 text-6xl mb-4'>
						<MoneySVG className='mx-auto size-16' />
					</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không có giao dịch nào
					</h3>
					<p className='text-gray-600 mb-6'>
						{search
							? `Không có giao dịch nào phù hợp với "${search}"`
							: isPaid !== null
							? `Không có giao dịch ${
									isPaid ? 'đã thanh toán' : 'chưa thanh toán'
							  }`
							: 'Chưa có giao dịch nào trong hệ thống.'}
					</p>
					{(search || isPaid !== null) && (
						<button
							onClick={() => {
								const url = new URL(window.location.href)
								url.searchParams.delete('search')
								url.searchParams.delete('isPaid')
								window.history.replaceState({}, '', url.toString())
							}}
							className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
						>
							Xóa bộ lọc
						</button>
					)}
				</div>
			</div>
		)
	}

	// Calculate stats
	const totalPurchases = data.length
	const paidPurchases = data.filter(p => p.isPaid).length
	const unpaidPurchases = totalPurchases - paidPurchases
	const totalAmount = data.reduce((sum, p) => sum + p.price, 0)

	const renderPurchaseItem = (purchase: any) => {
		return <PurchaseItem key={purchase.purchaseId} purchase={purchase} />
	}

	return (
		<div className='space-y-6'>
			{/* Stats */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-main'>{totalPurchases}</div>
					<div className='text-sm text-gray-600'>Tổng giao dịch</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-green-600'>
						{paidPurchases}
					</div>
					<div className='text-sm text-gray-600'>Đã thanh toán</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-yellow-600'>
						{unpaidPurchases}
					</div>
					<div className='text-sm text-gray-600'>Chưa thanh toán</div>
				</div>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 text-center'>
					<div className='text-2xl font-bold text-blue-600'>
						{totalAmount.toLocaleString('vi-VN')}
					</div>
					<div className='text-sm text-gray-600'>Tổng tiền (VND)</div>
				</div>
			</motion.div>

			{/* Purchase List */}
			<div className='relative'>
				{isFetching && (
					<div className='absolute inset-0 bg-white/50 flex items-center justify-center rounded-[20px] z-10'>
						<LoadingIcon className='size-6' />
					</div>
				)}

				<div className='space-y-4'>
					<AnimatePresence mode='wait'>
						{data.map((purchase, index) => (
							<motion.div
								key={purchase.purchaseId}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								exit={{ opacity: 0, x: 20 }}
								transition={{
									duration: 0.3,
									delay: index * 0.1,
								}}
							>
								{renderPurchaseItem(purchase)}
							</motion.div>
						))}
					</AnimatePresence>
				</div>
			</div>
		</div>
	)
}

export default PurchaseList
