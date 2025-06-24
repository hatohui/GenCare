import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	useCreateBirthControl,
	useUpdateBirthControl,
} from '@/Services/birthControl-service'
import { useBirthControl } from '@/Hooks/useBirthControl'
import RangeCalendar from '@/Components/Scheduling/Calendar/RangeCalendar'

const birthControlSchema = z.object({
	accountID: z.string().min(1, 'Account ID is required'),
	dateRange: z
		.tuple([
			z.union([z.date(), z.null()]), // <-- Allow null here too
			z.union([z.date(), z.null()]),
		])
		.refine(([start, end]) => start !== null && (!end || start <= end), {
			message: 'Start date must be before end date',
			path: ['dateRange'],
		}),
})

type BirthControlFormData = z.infer<typeof birthControlSchema>

interface BirthControlFormProps {
	accountID: string
}

const BirthControlForm: React.FC<BirthControlFormProps> = ({ accountID }) => {
	const { setBirthControl } = useBirthControl()
	const CreateBirthControl = useCreateBirthControl()
	const updateBirthControl = useUpdateBirthControl()

	const [startDate, setStartDate] = useState<Date | null>(null)
	const [endDate, setEndDate] = useState<Date | null>(null)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<BirthControlFormData>({
		resolver: zodResolver(birthControlSchema),
		defaultValues: {
			accountID,
			dateRange: [null, null] as any,
		},
	})

	// Sync selected dates with form state
	useEffect(() => {
		setValue('dateRange', [startDate, endDate])
	}, [startDate, endDate])

	const onSubmit = (data: BirthControlFormData) => {
		const [startDate, endDate] = data.dateRange

		if (!startDate) return

		CreateBirthControl.mutate(
			{
				accountId: accountID,
				startDate: startDate.toISOString(),
				endDate: endDate?.toISOString(),
			},
			{
				onSuccess: data => setBirthControl(data),
				onError: () => {
					updateBirthControl.mutate(
						{
							accountId: accountID,
							startDate: startDate.toISOString(),
							endDate: endDate?.toISOString(),
						},
						{ onSuccess: data => setBirthControl(data) }
					)
				},
			}
		)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className=''>
			<input type='hidden' {...register('accountID')} />

			<div className='items-center justify-center flex flex-col py-4'>
				<label className='block mb-2 text-main font-extrabold text-3xl text-center '>
					Chọn ngày hành kinh
				</label>
				<RangeCalendar
					startDate={startDate}
					endDate={endDate}
					setStartDate={setStartDate}
					setEndDate={setEndDate}
				/>
				{errors.dateRange && (
					<p className='text-red-500 text-sm mt-2'>
						{errors.dateRange.message as string}
					</p>
				)}
			</div>
		</form>
	)
}

export default BirthControlForm
