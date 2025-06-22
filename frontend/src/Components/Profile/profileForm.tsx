import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import { CloudinaryButton } from '../CloudinaryButton'

const schema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),

	phoneNumber: z.string().optional(),
	dateOfBirth: z.string().optional(),
	gender: z.boolean(),
	avatarUrl: z.string().url().optional(),
})

type FormData = z.infer<typeof schema>

interface ProfileFormProps {
	initialData: StaffAccount
	onSubmit: (formData: FormData) => void
	onCancel: () => void
}

const ProfileForm: React.FC<ProfileFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
}) => {
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: initialData.firstName,
			lastName: initialData.lastName,

			phoneNumber: initialData.phoneNumber ?? '',
			dateOfBirth: initialData.dateOfBirth ?? '',
			gender: initialData.gender,
			avatarUrl: initialData.avatarUrl ?? '',
		},
	})

	const handleUpload = (url: string) => {
		setValue('avatarUrl', url)
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className='space-y-4 bg-white p-6 rounded-lg shadow-lg'
		>
			<div className='grid grid-cols-2 gap-4'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						First Name
					</label>
					<input
						{...register('firstName')}
						className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					/>
					{errors.firstName && (
						<p className='mt-2 text-sm text-red-600'>
							{errors.firstName.message}
						</p>
					)}
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Last Name
					</label>
					<input
						{...register('lastName')}
						className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					/>
					{errors.lastName && (
						<p className='mt-2 text-sm text-red-600'>
							{errors.lastName.message}
						</p>
					)}
				</div>

				<div className='col-span-2'>
					<label className='block text-sm font-medium text-gray-700'>
						Phone
					</label>
					<input
						{...register('phoneNumber')}
						className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					/>
				</div>
				<div className='col-span-2'>
					<label className='block text-sm font-medium text-gray-700'>
						Date of Birth
					</label>
					<input
						type='date'
						{...register('dateOfBirth')}
						className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					/>
				</div>
				<div className='col-span-2'>
					<label className='block text-sm font-medium text-gray-700'>
						Gender
					</label>
					<select
						{...register('gender', { setValueAs: v => v === 'true' })}
						className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
					>
						<option value='true'>Nam</option>
						<option value='false'>Nữ</option>
					</select>
				</div>
				<div className='col-span-2'>
					<label className='block text-sm font-medium text-gray-700'>
						Avatar
					</label>
					<CloudinaryButton
						onUploaded={handleUpload}
						uploadPreset='gencare'
						text='Upload Image'
						className='mt-1 bg-gray-200 px-4 py-2 rounded hover:bg-gray-500'
					/>
				</div>
			</div>

			<div className='flex justify-end gap-2 mt-4'>
				<button
					type='button'
					onClick={onCancel}
					className='px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500'
				>
					Cancel
				</button>
				<button
					type='submit'
					className='px-4 py-2 bg-accent text-white rounded-full '
				>
					Save
				</button>
			</div>
		</form>
	)
}

export default ProfileForm
