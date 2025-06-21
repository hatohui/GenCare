import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

// Define the Zod schema for form validation
const birthControlSchema = z.object({
	accountID: z.string().min(1, 'Account ID is required'),
	startDate: z.date().refine(val => !isNaN(val.getTime()), {
		message: 'Start Date is required and should be a valid date',
	}),
	endDate: z.date().optional(),
})

type BirthControlFormData = z.infer<typeof birthControlSchema>

interface BirthControlFormProps {
	accountID: string // Receiving accountID as a prop
}

const BirthControlForm: React.FC<BirthControlFormProps> = ({ accountID }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BirthControlFormData>({
		resolver: zodResolver(birthControlSchema),
		defaultValues: {
			accountID,
			endDate: undefined, // Set endDate to undefined by default
		},
	})

	const onSubmit = (data: BirthControlFormData) => {
		// Handle the form submission
		console.log('Form submitted:', data)
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
			<div>
				<label htmlFor='accountID' className='block'>
					Account ID
				</label>
				<input
					{...register('accountID')}
					id='accountID'
					type='text'
					className='border p-2 w-full'
					disabled // Make the field read-only if it's coming from props
				/>
				{errors.accountID && (
					<p className='text-red-500'>{errors.accountID.message}</p>
				)}
			</div>

			<div>
				<label htmlFor='startDate' className='block'>
					Start Date
				</label>
				<input
					{...register('startDate', { valueAsDate: true })}
					id='startDate'
					type='date'
					className='border p-2 w-full'
				/>
				{errors.startDate && (
					<p className='text-red-500'>{errors.startDate.message}</p>
				)}
			</div>

			<div>
				<label htmlFor='endDate' className='block'>
					End Date (Optional)
				</label>
				<input
					{...register('endDate', { valueAsDate: true })}
					id='endDate'
					type='date'
					className='border p-2 w-full'
					placeholder='Optional'
				/>
				{errors.endDate && (
					<p className='text-red-500'>{errors.endDate.message}</p>
				)}
			</div>

			<button type='submit' className='bg-accent text-white p-2 rounded-full'>
				Submit
			</button>
		</form>
	)
}

export default BirthControlForm
