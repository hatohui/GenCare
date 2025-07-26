import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useCreateBirthControl,
	useUpdateBirthControl,
} from '@/Services/birthControl-service'
import { useBirthControl } from '@/Hooks/useBirthControl'
import SingleDateCalendar from '@/Components/Scheduling/Calendar/Calendar'
import { isSameDay } from 'date-fns'
import { toast } from 'react-hot-toast'
import LoadingIcon from '@/Components/LoadingIcon'
import { useLocale } from '@/Hooks/useLocale'

interface BirthControlFormProps {
	accountID: string
}

const BirthControlForm: React.FC<BirthControlFormProps> = ({ accountID }) => {
	const { t } = useLocale()

	// Create schema with localized messages
	const birthControlSchema = z.object({
		accountID: z.string().min(1, t('common.account_id_required')),
		startDate: z.date({
			required_error: t('birthControl.select_start_date_required'),
			invalid_type_error: t('common.invalid_date'),
		}),
	})

	type BirthControlFormData = z.infer<typeof birthControlSchema>

	const { setBirthControl } = useBirthControl()
	const createBirthControl = useCreateBirthControl()
	const updateBirthControl = useUpdateBirthControl()

	const [startDate, setStartDate] = useState<Date | null>(null)
	const [isSaving, setIsSaving] = useState(false)
	const lastSavedDateRef = useRef<Date | null>(null)

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
				toast.success(
					t('birthControl.date_saved', { 0: date.toLocaleDateString() })
				)
			} catch (error) {
				// If create fails, try to update
				try {
					const result = await updateBirthControl.mutateAsync({
						accountId: accountID,
						startDate: date.toISOString(),
					})

					// Update local state with the updated data
					setBirthControl(result)
					toast.success(
						t('birthControl.date_updated', { 0: date.toLocaleDateString() })
					)
				} catch (updateError) {
					console.error('Both create and update failed:', error, updateError)
					toast.error(t('birthControl.save_failed'))
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

	// Auto-save when date changes (only if different from last saved)
	useEffect(() => {
		if (
			startDate &&
			!isSaving &&
			(!lastSavedDateRef.current ||
				!isSameDay(startDate, lastSavedDateRef.current))
		) {
			handleSaveDate(startDate)
			lastSavedDateRef.current = startDate
		}
	}, [startDate, isSaving, handleSaveDate])

	return (
		<div className='bg-white p-6 rounded-[30px] shadow-sm border border-gray-200'>
			<div className='space-y-6'>
				<input type='hidden' {...register('accountID')} />

				{/* Header */}
				<div className='text-center'>
					<h2 className='text-2xl font-bold text-main mb-2'>
						{t('birthControl.cycle_tracking')}
					</h2>
					<p className='text-gray-600 text-sm'>
						{t('birthControl.select_cycle_start_date')}
					</p>
				</div>

				{/* Date Selection */}
				<div className='space-y-4'>
					<label className='block text-sm font-medium text-gray-700'>
						{t('birthControl.cycle_start_date')}
					</label>
					<div className='relative'>
						<SingleDateCalendar
							selectedDate={startDate}
							setSelectedDate={setStartDate}
							disablePastDates={false}
						/>
						{isSaving && (
							<div className='absolute inset-0 bg-white/80 flex items-center justify-center rounded-[15px]'>
								<div className='flex items-center gap-2 text-main'>
									<LoadingIcon className='size-4' />
									<span className='text-sm'>{t('birthControl.saving')}</span>
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
					<p>{t('birthControl.auto_save_info')}</p>
					<p>{t('birthControl.update_anytime')}</p>
				</div>
			</div>
		</div>
	)
}

export default BirthControlForm
