'use client'

import React, { useState } from 'react'
import { XMarkSVG, DownloadSVG, EyeSVG } from '@/Components/SVGs'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'

interface TestResultModalProps {
	isOpen: boolean
	onClose: () => void
	bookingItem: OrderDetail | null
}

// Interface for different test result types
interface GeneralTestResult {
	type: 'general'
	data: {
		results: Array<{
			parameter: string
			value: string | number
			unit?: string
			normalRange?: string
			status: 'normal' | 'abnormal' | 'borderline'
		}>
		summary: string
		recommendations: string
		doctor: string
		datePerformed: string
		// Add real data fields
		testId?: string
		patientId?: string
		serviceId?: string
		labTechnician?: string
		verifiedBy?: string
		verifiedAt?: string
		reportUrl?: string
	}
}

type TestResultData = GeneralTestResult

// Component for rendering general test results
const GeneralTestResultView = ({
	data,
}: {
	data: GeneralTestResult['data']
}) => {
	const getStatusColor = (status: string) => {
		switch (status) {
			case 'normal':
				return 'text-green-600 bg-green-50'
			case 'abnormal':
				return 'text-red-600 bg-red-50'
			case 'borderline':
				return 'text-yellow-600 bg-yellow-50'
			default:
				return 'text-gray-600 bg-gray-50'
		}
	}

	const getStatusText = (status: string) => {
		switch (status) {
			case 'normal':
				return 'Bình thường'
			case 'abnormal':
				return 'Bất thường'
			case 'borderline':
				return 'Giới hạn'
			default:
				return 'Không xác định'
		}
	}

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-main mb-4'>
				Kết quả khám tổng quát
			</h3>

			<div className='bg-white border border-gray-200 rounded-[15px] p-4 mb-4'>
				<div className='text-sm text-gray-600 mb-2'>
					Bác sĩ: {data.doctor} | Ngày thực hiện: {data.datePerformed}
				</div>
			</div>

			<div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
				{data.results.map((result, index) => (
					<div
						key={index}
						className='bg-white border border-gray-200 rounded-[15px] p-4 min-h-[120px]'
					>
						<div className='flex justify-between items-start mb-2'>
							<h4 className='font-medium text-gray-800 text-sm'>
								{result.parameter}
							</h4>
							<span
								className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
									result.status
								)}`}
							>
								{getStatusText(result.status)}
							</span>
						</div>
						<div className='text-xl font-bold text-main mb-1'>
							{result.value} {result.unit}
						</div>
						{result.normalRange && (
							<div className='text-xs text-gray-600'>
								Bình thường: {result.normalRange}
							</div>
						)}
					</div>
				))}
			</div>

			<div className='space-y-4'>
				<div className='bg-white border border-gray-200 rounded-[15px] p-4'>
					<h4 className='font-medium text-gray-800 mb-2'>Tóm tắt</h4>
					<p className='text-gray-700 text-sm leading-relaxed'>
						{data.summary}
					</p>
				</div>

				<div className='bg-white border border-gray-200 rounded-[15px] p-4'>
					<h4 className='font-medium text-gray-800 mb-2'>Khuyến nghị</h4>
					<p className='text-gray-700 text-sm leading-relaxed'>
						{data.recommendations}
					</p>
				</div>
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
	// Restore state and effect for mock data
	const [testResult, setTestResult] = useState<TestResultData | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	// Load test result when modal opens
	React.useEffect(() => {
		if (isOpen && bookingItem) {
			setIsLoading(true)
			// Simulate API call
			setTimeout(() => {
				const result = generateMockTestResult()
				setTestResult(result)
				setIsLoading(false)
			}, 1000)
		}
	}, [isOpen, bookingItem])

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
		if (!testResult) return null

		// Since we're only using general type now
		if (testResult.type === 'general') {
			return <GeneralTestResultView data={testResult.data} />
		}

		return <div>Không có dữ liệu kết quả</div>
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[9999] p-4 backdrop-blur-sm'>
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
				{!isLoading && testResult && (
					<div className='flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0'>
						<div className='text-sm text-gray-600'>
							Kết quả được tạo vào: {new Date().toLocaleDateString('vi-VN')}
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

// Restore the mock data generator
const generateMockTestResult = (): TestResultData => {
	// Simple fake data for all service types
	return {
		type: 'general',
		data: {
			results: [
				{
					parameter: 'Huyết áp',
					value: '120/80',
					unit: 'mmHg',
					normalRange: '<140/90',
					status: 'normal',
				},
				{
					parameter: 'Nhịp tim',
					value: 72,
					unit: 'bpm',
					normalRange: '60-100',
					status: 'normal',
				},
				{
					parameter: 'Nhiệt độ',
					value: 36.8,
					unit: '°C',
					normalRange: '36.5-37.5',
					status: 'normal',
				},
				{
					parameter: 'Cân nặng',
					value: 65,
					unit: 'kg',
					normalRange: 'N/A',
					status: 'normal',
				},
				{
					parameter: 'Đường huyết',
					value: 95,
					unit: 'mg/dL',
					normalRange: '70-100',
					status: 'normal',
				},
				{
					parameter: 'Cholesterol',
					value: 180,
					unit: 'mg/dL',
					normalRange: '<200',
					status: 'normal',
				},
			],
			summary:
				'Tất cả các chỉ số đều trong giới hạn bình thường. Sức khỏe tổng thể tốt.',
			recommendations:
				'Duy trì lối sống lành mạnh, tập thể dục đều đặn 30 phút mỗi ngày, ăn uống cân bằng dinh dưỡng.',
			doctor: 'Dr. Trần Thị B',
			datePerformed: new Date().toLocaleDateString('vi-VN'),
			testId: 'TEST-001',
			patientId: 'PAT-001',
			serviceId: 'SVC-001',
			labTechnician: 'Tech. Nguyễn Văn C',
			verifiedBy: 'Dr. Lê Thị D',
			verifiedAt: new Date().toISOString(),
			reportUrl: '/api/test-results/001/pdf',
		},
	}
}

export default TestResultModal
