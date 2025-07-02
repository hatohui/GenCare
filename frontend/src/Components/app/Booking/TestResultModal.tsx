'use client'

import React from 'react'
import { XMarkSVG, DownloadSVG, EyeSVG } from '@/Components/SVGs'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import { ResultData } from '@/Interfaces/Tests/Types/Tests'
import { useGetResult } from '@/Services/Result-service'

interface TestResultModalProps {
	isOpen: boolean
	onClose: () => void
	bookingItem: OrderDetail | null
}

// Component for rendering ResultData
const ResultDataView = ({ data }: { data: ResultData }) => {
	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-main mb-4'>
				Kết quả xét nghiệm
			</h3>
			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
				{Object.entries(data).map(([parameter, result], index) => (
					<div
						key={index}
						className='bg-white border border-gray-200 rounded-[15px] p-4 min-h-[120px]'
					>
						<div className='flex justify-between items-start mb-2'>
							<h4 className='font-medium text-gray-800 text-sm'>{parameter}</h4>
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${
									result.flag === 'normal'
										? 'text-green-600 bg-green-50'
										: result.flag === 'high'
										? 'text-red-600 bg-red-50'
										: result.flag === 'low'
										? 'text-yellow-600 bg-yellow-50'
										: 'text-gray-600 bg-gray-50'
								}`}
							>
								{result.flag === 'normal'
									? 'Bình thường'
									: result.flag === 'high'
									? 'Cao'
									: result.flag === 'low'
									? 'Thấp'
									: 'Không xác định'}
							</span>
						</div>
						<div className='text-xl font-bold text-main mb-1'>
							{result.value} {result.unit}
						</div>
						<div className='text-xs text-gray-600'>
							Bình thường: {result.referenceRange}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

// Main TestResultModal component
const TestResultModal: React.FC<TestResultModalProps> = ({
	isOpen,
	onClose,
	bookingItem,
}) => {
	const orderDetailId = bookingItem?.orderDetailId || ''
	const { data, isLoading, error } = useGetResult(orderDetailId, {
		enabled: isOpen && !!orderDetailId,
	})

	const handleClose = () => {
		onClose()
	}

	const handleDownloadPDF = () => {
		// TODO: Implement PDF download functionality
		console.log('Downloading PDF for:', bookingItem?.serviceName)
	}

	const handleViewFullReport = () => {
		// TODO: Navigate to full report page
		console.log('Viewing full report for:', bookingItem?.serviceName)
	}

	const renderTestResult = () => {
		if (isLoading) return <div>Đang tải kết quả...</div>
		if (error) return <div className='text-red-500'>Lỗi khi tải kết quả.</div>
		if (!data || !data.resultData)
			return <div>Không có kết quả xét nghiệm.</div>
		return <ResultDataView data={data.resultData} />
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[20] p-4 backdrop-blur-sm'>
			<div className='bg-white rounded-[30px] max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl relative'>
				{/* Header */}
				<div className='flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0'>
					<div>
						<h2 className='text-xl font-bold text-main'>Kết quả xét nghiệm</h2>
						<p className='text-gray-600 text-sm'>
							{bookingItem?.serviceName} - {bookingItem?.firstName}{' '}
							{bookingItem?.lastName}
						</p>
					</div>
					<button
						onClick={handleClose}
						className='text-gray-400 hover:text-gray-600 transition-colors'
					>
						<XMarkSVG className='size-6' />
					</button>
				</div>

				{/* Content */}
				<div className='flex-1 overflow-y-auto p-6'>{renderTestResult()}</div>

				{/* Footer */}
				{!isLoading && data && data.resultData && (
					<div className='flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0'>
						<div className='text-sm text-gray-600'>
							Kết quả được tạo vào:{' '}
							{data.resultDate
								? new Date(data.resultDate).toLocaleDateString('vi-VN')
								: '---'}
						</div>
						<div className='flex gap-3'>
							<button
								onClick={handleViewFullReport}
								className='flex items-center gap-2 px-4 py-2 text-main border border-main rounded-[20px] hover:bg-main hover:text-white transition-colors'
							>
								<EyeSVG className='size-4' />
								Xem chi tiết
							</button>
							<button
								onClick={handleDownloadPDF}
								className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-[20px] hover:bg-main/90 transition-colors'
							>
								<DownloadSVG className='size-4' />
								Tải PDF
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default TestResultModal
