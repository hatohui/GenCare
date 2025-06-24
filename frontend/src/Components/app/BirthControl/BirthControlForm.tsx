import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
	useCreateBirthControl,
	useUpdateBirthControl,
} from '@/Services/birthControl-service'

const birthControlSchema = z.object({
	accountID: z.string().min(1, 'Account ID is required'),
	dateRange: z
		.tuple([
			z.date().refine(val => !isNaN(val.getTime()), {
				message: 'Invalid start date',
			}),
			z.union([z.date(), z.null()]), // <-- Allow endDate to be null
		])
		.refine(([start, end]) => !end || start <= end, {
			message: 'Start date must be before end date',
			path: ['dateRange'],
		}),
})

type BirthControlFormData = z.infer<typeof birthControlSchema>

interface BirthControlFormProps {
	accountID: string
}

const BirthControlForm: React.FC<BirthControlFormProps> = ({ accountID }) => {
	const CreateBirthControl = useCreateBirthControl()
	const updateBirthControl = useUpdateBirthControl()

	const {
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors },
	} = useForm<BirthControlFormData>({
		resolver: zodResolver(birthControlSchema),
		defaultValues: {
			accountID,
			dateRange: [undefined as any, undefined as any],
		},
	})

	const onSubmit = (data: BirthControlFormData) => {
		const [startDate, endDate] = data.dateRange

		CreateBirthControl.mutate(
			{
				accountId: accountID,
				startDate: startDate.toISOString(),
				endDate: endDate?.toISOString(),
			},
			{
				onSuccess: () => {},
				onError: () => {
					updateBirthControl.mutate({
						accountId: accountID,
						startDate: startDate.toISOString(),
						endDate: endDate?.toISOString(),
					})
				},
			}
		)

		console.log('Form submitted:', data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			<input type='hidden' {...register('accountID')} />

			<div>
				<label htmlFor='dateRange' className='block mb-2'>
					Birth Control Date
				</label>
				<DatePicker
					selectsRange
					startDate={watch('dateRange')?.[0]}
					endDate={watch('dateRange')?.[1]}
					onChange={dates => setValue('dateRange', dates as [Date, Date])}
					dateFormat='yyyy-MM-dd'
					placeholderText='Select date range'
					isClearable
					className='w-full border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
					calendarClassName='rounded-xl shadow-lg bg-white p-4 border border-gray-200'
					popperClassName='z-50'
					dayClassName={date => {
						const today = new Date()
						const isToday =
							date.getDate() === today.getDate() &&
							date.getMonth() === today.getMonth() &&
							date.getFullYear() === today.getFullYear()

						return `rounded-full w-10 h-10 flex items-center justify-center transition-all
      ${
				isToday
					? 'border border-blue-500 text-blue-600 font-semibold'
					: 'hover:bg-blue-100'
			}`
					}}
				/>
				{errors.dateRange && (
					<p className='text-red-500'>{errors.dateRange.message as string}</p>
				)}
			</div>

			<button
				type='submit'
				className='bg-accent text-white p-2 rounded-full hover:bg-rose-500 duration-300'
			>
				Submit
			</button>
		</form>
	)
}

export default BirthControlForm
