import React, { useEffect, useState, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useCreateBirthControl,
	useUpdateBirthControl,
} from '@/Services/birthControl-service'
import { useBirthControl } from '@/Hooks/useBirthControl'
import SingleDateCalendar from '@/Components/Scheduling/Calendar/Calendar'
import { toast } from 'react-hot-toast'
import LoadingIcon from '@/Components/LoadingIcon'

const birthControlSchema = z.object({
	accountID: z.string().min(1, 'Account ID is required'),
	startDate: z.date({
		required_error: 'Vui lòng chọn ngày bắt đầu chu kỳ',
		invalid_type_error: 'Ngày không hợp lệ',
	}),
})

type BirthControlFormData = z.infer<typeof birthControlSchema>

interface BirthControlFormProps {
	accountID: string
}

const BirthControlForm: React.FC<BirthControlFormProps> = ({ accountID }) => {
	const { setBirthControl } = useBirthControl()
	const createBirthControl = useCreateBirthControl()
	const updateBirthControl = useUpdateBirthControl()

	const [startDate, setStartDate] = useState<Date | null>(null)
	const [isSaving, setIsSaving] = useState(false)

	const {
		register,
		setValue,
		formState: { errors },
	} = useForm<BirthControlFormData>({
		resolver: zodResolver(birthControlSchema),
		defaultValues: {
			accountID,
		},
	})

	// Handle async save operation
	const handleSaveDate = useCallback(
		async (date: Date) => {
			setIsSaving(true)
			setValue('startDate', date)

			try {
				// Try to create first
				const result = await createBirthControl.mutateAsync({
					accountId: accountID,
					startDate: date.toISOString(),
				})

				// Update local state with the new data
				setBirthControl(result)
				toast.success(`Đã lưu ngày: ${date.toLocaleDateString('vi-VN')}`)
			} catch (error) {
				// If create fails, try to update
				try {
					const result = await updateBirthControl.mutateAsync({
						accountId: accountID,
						startDate: date.toISOString(),
					})

					// Update local state with the updated data
					setBirthControl(result)
					toast.success(`Đã cập nhật ngày: ${date.toLocaleDateString('vi-VN')}`)
				} catch (updateError) {
					console.error('Both create and update failed:', error, updateError)
					toast.error('Không thể lưu thông tin. Vui lòng thử lại sau.')
				}
			} finally {
				setIsSaving(false)
			}
		},
		[
			accountID,
			setValue,
			createBirthControl,
			updateBirthControl,
			setBirthControl,
		]
	)

	// Auto-save when date changes
	useEffect(() => {
		if (startDate) {
			handleSaveDate(startDate)
		}
	}, [startDate, handleSaveDate])

	return (
		<div className='bg-white p-6 rounded-[30px] shadow-sm border border-gray-200'>
			<div className='space-y-6'>
				<input type='hidden' {...register('accountID')} />

				{/* Header */}
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-main mb-2'>Theo Dõi Chu Kỳ</h2>
					<p className='text-gray-600 text-sm'>
						Chọn ngày bắt đầu chu kỳ kinh nguyệt của bạn
					</p>
				</div>

				{/* Date Selection */}
				<div className='space-y-4'>
					<label className='block text-sm font-medium text-gray-700'>
						Ngày bắt đầu chu kỳ
					</label>
					<div className='relative'>
						<SingleDateCalendar
							selectedDate={startDate}
							setSelectedDate={setStartDate}
						/>
						{isSaving && (
							<div className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-[15px]'>
								<div className='flex items-center gap-2 text-main'>
									<LoadingIcon className='size-4' />
									<span className='text-sm'>Đang lưu...</span>
								</div>
							</div>
						)}
					</div>
					{errors.startDate && (
						<p className='text-red-500 text-sm mt-1'>
							{errors.startDate.message}
						</p>
					)}
				</div>

				{/* Info */}
				<div className='text-xs text-gray-500 text-center'>
					<p>Thông tin sẽ được lưu tự động khi bạn chọn ngày</p>
					<p>Bạn có thể cập nhật bất cứ lúc nào</p>
				</div>
			</div>
		</div>
	)
}

export default BirthControlForm
