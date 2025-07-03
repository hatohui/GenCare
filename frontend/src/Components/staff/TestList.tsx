'use client'

import React, { useEffect, useState } from 'react'
import { useViewPurchaseById } from '@/Services/book-service'
import { useSearchParams } from 'next/navigation'
import LoadingIcon from '../LoadingIcon'
import { UserSVG } from '../SVGs'
import TestOrderItem from './TestOrderItem'
import { Result } from '@/Interfaces/Tests/Types/Tests'

const mapOrderToResult = (order: any): Result => ({
	orderDetailId: order.orderDetailId,
	orderDate: new Date(order.createdAt),
	sampleDate: order.sampleDate ? new Date(order.sampleDate) : undefined,
	resultDate: order.resultDate ? new Date(order.resultDate) : undefined,
	status: order.status || false,
	resultData: order.resultData || undefined,
	updatedAt: order.updatedAt ? new Date(order.updatedAt) : undefined,
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
			{data.map((purchase: any) => {
				// Map each order in the purchase to a Result object
				const results = purchase.order.map((order: any) =>
					mapOrderToResult(order)
				)
				return results.map((result: Result) => (
					<TestOrderItem key={result.orderDetailId} result={result} />
				))
			})}
		</div>
	)
}

export default TestList
