import React, { useEffect, useState } from 'react'
import { useGetResult, useUpdateResult } from '@/Services/Result-service'
import LoadingIcon from '../LoadingIcon'

interface TestResultEditFormProps {
	orderDetailId: string
	onSuccess?: () => void
}

const TestResultEditForm: React.FC<TestResultEditFormProps> = ({
	orderDetailId,
	onSuccess,
}) => {
	const { data, isLoading, error } = useGetResult(orderDetailId)
	const updateResult = useUpdateResult()

	const [orderDate, setOrderDate] = useState('')
	const [sampleDate, setSampleDate] = useState('')
	const [resultDate, setResultDate] = useState('')
	const [status, setStatus] = useState(false)
	const [resultData, setResultData] = useState('')
	const [jsonError, setJsonError] = useState<string | null>(null)
	const [success, setSuccess] = useState(false)

	useEffect(() => {
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
	}, [data])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setJsonError(null)
		setSuccess(false)
		let parsedResultData
		try {
			parsedResultData = resultData ? JSON.parse(resultData) : {}
		} catch (err) {
			setJsonError('resultData phải là JSON hợp lệ!')
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
		>
			<h2 className='text-xl font-bold text-main mb-4'>
				Chỉnh sửa kết quả xét nghiệm
			</h2>
			<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Ngày đặt
					</label>
					<input
						type='date'
						className='input input-bordered w-full'
						value={orderDate}
						onChange={e => setOrderDate(e.target.value)}
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Ngày lấy mẫu
					</label>
					<input
						type='date'
						className='input input-bordered w-full'
						value={sampleDate}
						onChange={e => setSampleDate(e.target.value)}
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Ngày trả kết quả
					</label>
					<input
						type='date'
						className='input input-bordered w-full'
						value={resultDate}
						onChange={e => setResultDate(e.target.value)}
					/>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700 mb-1'>
						Trạng thái
					</label>
					<select
						className='input input-bordered w-full'
						value={status ? 'completed' : 'pending'}
						onChange={e => setStatus(e.target.value === 'completed')}
					>
						<option value='pending'>Chưa hoàn thành</option>
						<option value='completed'>Đã hoàn thành</option>
					</select>
				</div>
			</div>
			<div>
				<label className='block text-sm font-medium text-gray-700 mb-1'>
					resultData (JSON)
				</label>
				<textarea
					className='input input-bordered w-full font-mono min-h-[120px]'
					value={resultData}
					onChange={e => setResultData(e.target.value)}
					placeholder='{"key": "value"}'
				/>
				{jsonError && (
					<div className='text-red-500 text-sm mt-1'>{jsonError}</div>
				)}
			</div>
			<button
				type='submit'
				className='bg-main text-white px-6 py-3 rounded-[30px] font-medium hover:bg-main/90 transition-colors disabled:opacity-60'
				disabled={updateResult.isPending}
			>
				{updateResult.isPending ? 'Đang cập nhật...' : 'Cập nhật kết quả'}
			</button>
			{updateResult.isError && (
				<div className='text-red-500 mt-2'>Có lỗi khi cập nhật kết quả.</div>
			)}
			{success && (
				<div className='text-green-600 mt-2'>Cập nhật thành công!</div>
			)}
		</form>
	)
}

export default TestResultEditForm
