'use client'

import React from 'react'
import { XMarkSVG, DownloadSVG, EyeSVG } from '@/Components/SVGs'
import { OrderDetail } from '@/Interfaces/Payment/Types/BookService'
import { format as formatDateFns } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ResultData } from '@/Interfaces/Tests/Types/Tests'
import { useGetResult } from '@/Services/Result-service'
import { useCreateBookingPDF } from '@/Services/book-service'
import { useLocale } from '@/Hooks/useLocale'

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

// Mock data generator (replace with your real data)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			datePerformed: formatDateFns(new Date(), 'dd/MM/yyyy', { locale: vi }),
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

// Component for rendering general test results
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GeneralTestResultView = ({
	data,
}: {
	data: GeneralTestResult['data']
}) => {
	const { t } = useLocale()
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
				return t('test.normal')
			case 'abnormal':
				return t('test.abnormal')
			case 'borderline':
				return t('test.borderline')
			default:
				return t('test.undefined')
		}
	}

	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-main mb-4'>
				{t('test.general_results')}
			</h3>
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
								{t('test.normal_range')} {result.normalRange}
							</div>
						)}
					</div>
				))}
			</div>
			<div className='bg-blue-50 border border-blue-200 rounded-[15px] p-4 mb-4'>
				<h4 className='font-medium text-blue-800 mb-2'>{t('test.summary')}</h4>
				<p className='text-blue-700 text-sm'>{data.summary}</p>
			</div>
			<div className='bg-green-50 border border-green-200 rounded-[15px] p-4'>
				<h4 className='font-medium text-green-800 mb-2'>Khuyến nghị</h4>
				<p className='text-green-700 text-sm'>{data.recommendations}</p>
			</div>
		</div>
	)
}

// Component for rendering ResultData
const ResultDataView = ({ data }: { data: ResultData }) => {
	const { t } = useLocale()
	return (
		<div className='space-y-4'>
			<h3 className='text-lg font-semibold text-main mb-4'>
				{t('test.results_title')}
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
									? t('test.normal')
									: result.flag === 'high'
									? t('test.high')
									: result.flag === 'low'
									? t('test.low')
									: t('test.undefined')}
							</span>
						</div>
						<div className='text-xl font-bold text-main mb-1'>
							{result.value} {result.unit}
						</div>
						<div className='text-xs text-gray-600'>
							{t('test.normal_range')} {result.referenceRange}
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
	const { t } = useLocale()
	const orderDetailId = bookingItem?.orderDetailId || ''
	const { data, isLoading, error, refetch } = useGetResult(orderDetailId, {
		enabled: isOpen && !!orderDetailId,
	})

	const createBookingPDF = useCreateBookingPDF()

	const handleClose = () => {
		onClose()
	}

	const handleDownloadPDF = async () => {
		if (!orderDetailId || !bookingItem) {
			console.error('No order detail ID or booking item available')
			return
		}
		try {
			// Always fetch the latest result before generating PDF
			const { data: latestResult } = await refetch()
			const pdfBlob = await createBookingPDF(bookingItem, latestResult)
			const url = window.URL.createObjectURL(
				new Blob([pdfBlob], { type: 'application/pdf' })
			)
			const link = document.createElement('a')
			link.href = url
			link.download = `ket-qua-xet-nghiem-${
				bookingItem.serviceName || 'test'
			}-${orderDetailId}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			window.URL.revokeObjectURL(url)
		} catch (error) {
			console.error('Error downloading PDF:', error)
			// You might want to show a toast notification here
		}
	}

	const handleViewFullReport = () => {
		// TODO: Navigate to full report page
		console.log('Viewing full report for:', bookingItem?.serviceName)
	}

	const renderTestResult = () => {
		if (isLoading) return <div>{t('test.loading_results')}</div>
		if (error)
			return <div className='text-red-500'>{t('test.loading_error')}</div>
		if (!data || !data.resultData) return <div>{t('test.no_results')}</div>
		return <ResultDataView data={data.resultData} />
	}

	if (!isOpen) return null

	return (
		<div className='fixed inset-0 bg-black/70 flex items-center justify-center z-[20] p-4 backdrop-blur-sm'>
			<div className='bg-white rounded-[30px] max-w-4xl w-full h-[90vh] flex flex-col shadow-2xl relative'>
				{/* Header */}
				<div className='flex justify-between items-center p-6 border-b border-gray-200 flex-shrink-0'>
					<div>
						<h2 className='text-xl font-bold text-main'>
							{t('test.results_title')}
						</h2>
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
							{t('test.generated_on')}{' '}
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
								{t('test.view_details')}
							</button>
							<button
								onClick={handleDownloadPDF}
								disabled={isLoading}
								className='flex items-center gap-2 px-4 py-2 bg-main text-white rounded-[20px] hover:bg-main/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
							>
								<DownloadSVG className='size-4' />
								{isLoading
									? t('booking.downloading')
									: t('booking.download_pdf')}
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default TestResultModal
