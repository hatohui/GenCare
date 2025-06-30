'use client'

import React, { useEffect, useState } from 'react'
import { useViewPurchaseById } from '@/Services/book-service'
import { useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'motion/react'
import LoadingIcon from '../LoadingIcon'
import { UserSVG } from '../SVGs'
import StatusBadge from '@/Components/Lab/StatusBadge'
import TestResultEditModal from './TestResultEditModal'
import TestOrderItem from './TestOrderItem'

interface TestOrder {
	orderDetailId: string
	patientName: string
	testType: string
	orderDate: string
	sampleDate: string | null
	resultDate: string | null
	status: 'completed' | 'pending'
	accountId?: string
}

const mapOrderToTestOrder = (order: any): TestOrder => ({
	orderDetailId: order.orderDetailId,
	patientName: (order.firstName + ' ' + order.lastName).trim(),
	testType: order.serviceName,
	orderDate: order.createdAt as unknown as string,
	sampleDate: (order as any).sampleDate || null,
	resultDate: (order as any).resultDate || null,
	status: order.status ? 'completed' : 'pending',
	accountId: order.accountId || (order as any).accountId || '',
})

const TestList = ({ id }: { id: string }) => {
	const searchParams = useSearchParams()
	const [search, setSearch] = useState<string>('')

	const { data, error, isLoading } = useViewPurchaseById(id, search, null)

	useEffect(() => {
		setSearch(searchParams?.get('search') || '')
	}, [searchParams])

	// Loading state
	if (isLoading && !data) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4 size-8' />
					<p className='text-gray-600'>Đang tải danh sách xét nghiệm...</p>
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
						Đã xảy ra lỗi khi tải danh sách xét nghiệm. Vui lòng thử lại sau.
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
						<UserSVG className='mx-auto size-16' />
					</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không có xét nghiệm nào
					</h3>
					<p className='text-gray-600 mb-6'>
						{search
							? `Không có xét nghiệm nào phù hợp với "${search}"`
							: 'Chưa có xét nghiệm nào cho tài khoản này.'}
					</p>
					{search && (
						<button
							onClick={() => {
								const url = new URL(window.location.href)
								url.searchParams.delete('search')
								window.history.replaceState({}, '', url.toString())
							}}
							className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
						>
							Xóa bộ lọc tìm kiếm
						</button>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-6'>
			{data.map((purchase: any, idx: number) => (
				<TestOrderItem key={purchase.purchaseId} purchase={purchase} />
			))}
		</div>
	)
}

export default TestList
