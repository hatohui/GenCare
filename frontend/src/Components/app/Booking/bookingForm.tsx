'use client'

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServiceById } from '@/Services/service-services'
import {
	BookServiceFormProps,
	formSchema,
	FormSchema,
} from '@/Interfaces/Payment/schema/BookService'
import { useBookServices } from '@/Services/book-service'
import { TrashCanSVG } from '@/Components/SVGs'
import { useRouter } from 'next/navigation'

const BookServiceForm: React.FC<BookServiceFormProps> = ({ serviceId }) => {
	const { data, isLoading } = useServiceById(serviceId)
	const updateBooking = useBookServices()
	const router = useRouter()

	const {
		register,
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			people: [
				{
					firstName: '',
					lastName: '',
					phoneNumber: '',
					dateOfBirth: '',
					gender: false,
					serviceId: serviceId,
				},
			],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'people',
	})

	const onSubmit = (data: FormSchema) => {
		console.log('Submitted:', { OrderDetails: data.people })
		updateBooking.mutate(
			{ OrderDetails: data.people },
			{
				onSuccess: () => {
					router.push('/app/booking')
				},
			}
		)
	}

	if (isLoading || !data) {
		return <div className='text-center py-10'>Loading service info...</div>
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-6 max-w-3xl mx-auto'
		>
			<h2 className='text-2xl font-bold text-center text-main'>Book Service</h2>

			{fields.map((field, index) => (
				<div
					key={field.id}
					className='grid grid-cols-2 gap-4 p-7 rounded-[30px] bg-gray-50 relative'
				>
					<button
						type='button'
						onClick={() => remove(index)}
						className='absolute top-2 right-7 text-red-500 text-sm hover:bg-red-100 rounded-full transition-colors duration-300 p-2 '
					>
						<TrashCanSVG />
					</button>

					{/* Display Service Name */}
					<div className='col-span-2'>
						<label className='block text-sm font-medium'>Service</label>
						<input
							type='text'
							value={data.name}
							readOnly
							className='mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600'
						/>
					</div>

					<div className='col-span-2'>
						<label className='block text-sm font-medium'></label>
						<input
							type='text'
							value={serviceId}
							hidden
							{...register(`people.${index}.serviceId`)}
							className='mt-1 w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600'
						/>
					</div>

					<div>
						<label className='block text-sm font-medium'>Phone Number</label>
						<input
							type='text'
							{...register(`people.${index}.phoneNumber`)}
							className='mt-1 input w-full'
							placeholder='0912323..'
						/>
						<p className='text-red-500 text-sm'>
							{errors.people?.[index]?.phoneNumber?.message}
						</p>
					</div>

					<div>
						<label className='block text-sm font-medium'>First Name</label>
						<input
							type='text'
							{...register(`people.${index}.firstName`)}
							className='mt-1 input w-full'
							placeholder='Nguyen'
						/>
						<p className='text-red-500 text-sm'>
							{errors.people?.[index]?.firstName?.message}
						</p>
					</div>

					<div>
						<label className='block text-sm font-medium'>Last Name</label>
						<input
							type='text'
							{...register(`people.${index}.lastName`)}
							className='mt-1 input w-full'
							placeholder='Thanh'
						/>
						<p className='text-red-500 text-sm'>
							{errors.people?.[index]?.lastName?.message}
						</p>
					</div>

					<div>
						<label className='block text-sm font-medium'>Date of Birth</label>
						<input
							type='date'
							{...register(`people.${index}.dateOfBirth`)}
							className='mt-1 input w-full'
						/>
						<p className='text-red-500 text-sm'>
							{errors.people?.[index]?.dateOfBirth?.message}
						</p>
					</div>

					<div className='flex items-center gap-4 mt-6'>
						<label className='block text-sm font-medium'>Gender</label>
						<select
							{...register(`people.${index}.gender`, {
								setValueAs: (v: string): boolean => v === 'true',
							})}
							className='input'
						>
							<option value='true'>Nam</option>
							<option value='false'>Nữ</option>
						</select>

						<p className='text-red-500 text-sm'>
							{errors.people?.[index]?.gender?.message}
						</p>
					</div>
				</div>
			))}

			<button
				type='button'
				onClick={() =>
					append({
						firstName: '',
						lastName: '',
						phoneNumber: '',
						dateOfBirth: '',
						gender: true,
						serviceId: serviceId,
					})
				}
				className='bg-main hover:bg-blue-600 text-white px-4 py-2 rounded'
			>
				Add Person
			</button>

			<button
				type='submit'
				className='block mx-auto bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded text-lg'
			>
				Submit Booking
			</button>
		</form>
	)
}

export default BookServiceForm
