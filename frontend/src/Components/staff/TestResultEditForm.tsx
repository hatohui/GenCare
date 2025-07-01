import React, { useEffect, useState } from 'react'
import { useGetResult, useUpdateResult } from '@/Services/Result-service'
import LoadingIcon from '../LoadingIcon'
import { ResultData } from '@/Interfaces/Tests/Types/Tests'
import FloatingLabelInput from '../Form/FloatingLabel'
import ErrorMessage from '../Chat/ErrorMessage'
import ConfirmDialog from '../ConfirmationDialog'

interface TestResultEditFormProps {
	orderDetailId: string
	onSuccess?: () => void
	useMock?: boolean
}

const TestResultEditForm: React.FC<TestResultEditFormProps> = ({
	orderDetailId,
	onSuccess,
	useMock = false,
}) => {
	const { data, isLoading, error } = useGetResult(orderDetailId)
	const updateResult = useUpdateResult()

	const [orderDate, setOrderDate] = useState('')
	const [sampleDate, setSampleDate] = useState('')
	const [resultDate, setResultDate] = useState('')
	const [status, setStatus] = useState(false)
	const [resultData, setResultData] = useState<string>('')
	const [jsonError, setJsonError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)
	const [showConfirm, setShowConfirm] = useState(false)

	const mockResultData = {
		glucose: {
			value: 92,
			unit: 'mg/dL',
			referenceRange: '70-100',
			flag: 'normal',
		},
		cholesterol: {
			value: 180,
			unit: 'mg/dL',
			referenceRange: '125-200',
			flag: 'normal',
		},
		hemoglobin: {
			value: 13.5,
			unit: 'g/dL',
			referenceRange: '13.0-17.0',
			flag: 'normal',
		},
	}

	useEffect(() => {
		if (useMock) {
			const today = new Date()
			setOrderDate(today.toISOString().slice(0, 10))
			setSampleDate(today.toISOString().slice(0, 10))
			setResultDate(today.toISOString().slice(0, 10))
			setStatus(true)
			setResultData(JSON.stringify(mockResultData, null, 2))
			return
		}
		if (data) {
			setOrderDate(
				data.orderDate
					? new Date(data.orderDate).toISOString().slice(0, 10)
					: ''
			)
			setSampleDate(
				data.sampleDate
					? new Date(data.sampleDate).toISOString().slice(0, 10)
					: ''
			)
			setResultDate(
				data.resultDate
					? new Date(data.resultDate).toISOString().slice(0, 10)
					: ''
			)
			setStatus(!!data.status)
			setResultData(
				data.resultData ? JSON.stringify(data.resultData, null, 2) : ''
			)
		}
	}, [data, useMock])

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setJsonError(null)
		setSuccess(false)
		setShowConfirm(true)
	}

	const handleConfirm = async () => {
		setShowConfirm(false)
		let parsedResultData: ResultData
		try {
			parsedResultData = resultData ? JSON.parse(resultData) : {}
		} catch (err) {
			setJsonError('resultData phải là JSON hợp lệ và đúng cấu trúc!')
			return
		}
		updateResult.mutate(
			{
				id: orderDetailId,
				data: {
					orderDate: orderDate ? new Date(orderDate) : undefined,
					sampleDate: sampleDate ? new Date(sampleDate) : undefined,
					resultDate: resultDate ? new Date(resultDate) : undefined,
					status,
					resultData: parsedResultData,
				},
			},
			{
				onSuccess: () => {
					setSuccess(true)
					if (onSuccess) onSuccess()
					setTimeout(() => setSuccess(false), 2000)
				},
			}
		)
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[200px]'>
				<LoadingIcon className='size-8' />
			</div>
		)
	}
	if (error) {
		return <div className='text-red-500'>Không thể tải dữ liệu kết quả.</div>
	}

	return (
		<form
			onSubmit={handleSubmit}
			className='space-y-6 max-w-xl mx-auto bg-white p-6 rounded-xl border border-gray-200 shadow'
			aria-label='Chỉnh sửa kết quả xét nghiệm'
		>
			<h2 className='text-xl font-bold text-main mb-4'>
				Chỉnh sửa kết quả xét nghiệm
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<FloatingLabelInput
					label='Ngày đặt'
					id='orderDate'
					type='date'
					value={orderDate}
					onChange={e => setOrderDate(e.target.value)}
					required
					className='mb-2'
				/>
				<FloatingLabelInput
					label='Ngày lấy mẫu'
					id='sampleDate'
					type='date'
					value={sampleDate}
					onChange={e => setSampleDate(e.target.value)}
					required
					className='mb-2'
				/>
				<FloatingLabelInput
					label='Ngày trả kết quả'
					id='resultDate'
					type='date'
					value={resultDate}
					onChange={e => setResultDate(e.target.value)}
					required
					className='mb-2'
				/>
				<div>
					<label
						htmlFor='status'
						className='block text-sm font-medium text-gray-700 mb-1'
					>
						Trạng thái
					</label>
					<select
						id='status'
						className='input input-bordered w-full'
						value={status ? 'completed' : 'pending'}
						onChange={e => setStatus(e.target.value === 'completed')}
						aria-label='Trạng thái'
					>
						<option value='pending'>Chưa hoàn thành</option>
						<option value='completed'>Đã hoàn thành</option>
					</select>
				</div>
			</div>
			<div>
				<label
					htmlFor='resultData'
					className='block text-sm font-medium text-gray-700 mb-1'
				>
					resultData (JSON)
				</label>
				<textarea
					id='resultData'
					className='input input-bordered w-full font-mono min-h-[120px]'
					value={resultData}
					onChange={e => setResultData(e.target.value)}
					placeholder='{"glucose": {"value": 90, "unit": "mg/dL", "referenceRange": "70-100", "flag": "normal"}}'
					aria-describedby='resultDataHelp'
				/>
				<div id='resultDataHelp' className='text-xs text-gray-500 mt-1'>
					Nhập dữ liệu kết quả xét nghiệm dưới dạng JSON hợp lệ.
				</div>
				{jsonError && <ErrorMessage />}
				{jsonError && (
					<div className='text-red-500 text-sm mt-1'>{jsonError}</div>
				)}
			</div>
			<button
				type='button'
				className='bg-gray-200 text-gray-700 px-4 py-2 rounded-[30px] font-medium hover:bg-gray-300 transition-colors mb-2 w-full'
				tabIndex={0}
			>
				Tự động điền dữ liệu mẫu
			</button>
			<button
				type='submit'
				className='bg-main text-white px-6 py-3 rounded-[30px] font-medium hover:bg-main/90 transition-colors disabled:opacity-60 w-full'
				disabled={updateResult.isPending}
				aria-busy={updateResult.isPending}
			>
				{updateResult.isPending ? (
					<LoadingIcon className='inline-block mr-2 align-middle' />
				) : null}
				{updateResult.isPending ? 'Đang cập nhật...' : 'Cập nhật kết quả'}
			</button>
			{updateResult.isError && <ErrorMessage />}
			{success && (
				<div className='text-green-600 mt-2'>Cập nhật thành công!</div>
			)}
			<ConfirmDialog
				isOpen={showConfirm}
				title='Xác nhận cập nhật'
				message='Bạn có chắc chắn muốn lưu thay đổi kết quả xét nghiệm này?'
				onConfirm={handleConfirm}
				onCancel={() => setShowConfirm(false)}
			/>
		</form>
	)
}

export default TestResultEditForm
