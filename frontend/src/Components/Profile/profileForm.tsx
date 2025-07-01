import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'

const schema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	phoneNumber: z.string().optional(),
	dateOfBirth: z.string().optional(),
	gender: z.preprocess(
		v => (v === true || v === 'true' ? true : false),
		z.boolean()
	),
})

type FormData = z.infer<typeof schema>

type FormInput = z.input<typeof schema>

interface ProfileFormProps {
	initialData: StaffAccount
	onSubmit: (formData: FormData) => void
	onCancel: () => void
}

// Dynamic field configuration
const fields = [
	{
		name: 'firstName',
		label: 'First Name',
		type: 'text',
		colSpan: 1,
	},
	{
		name: 'lastName',
		label: 'Last Name',
		type: 'text',
		colSpan: 1,
	},
	{
		name: 'phoneNumber',
		label: 'Phone',
		type: 'text',
		colSpan: 2,
	},
	{
		name: 'dateOfBirth',
		label: 'Date of Birth',
		type: 'date',
		colSpan: 2,
	},
	{
		name: 'gender',
		label: 'Gender',
		type: 'select',
		colSpan: 2,
		options: [
			{ value: 'true', label: 'Nam' },
			{ value: 'false', label: 'Nữ' },
		],
	},
]

const ProfileForm: React.FC<ProfileFormProps> = ({
	initialData,
	onSubmit,
	onCancel,
}) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<FormInput>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: initialData.firstName,
			lastName: initialData.lastName,
			phoneNumber: initialData.phoneNumber ?? '',
			dateOfBirth: initialData.dateOfBirth ?? '',
			gender: String(initialData.gender),
		},
	})

	return (
		<form
			onSubmit={handleSubmit(data => {
				onSubmit(data as FormData)
			})}
			className='space-y-4 bg-white p-6 rounded-lg shadow-lg'
		>
			<div className='grid grid-cols-2 gap-4'>
				{fields.map(field => (
					<div
						key={field.name}
						className={field.colSpan === 2 ? 'col-span-2' : ''}
					>
						<label className='block text-sm font-medium text-gray-700'>
							{field.label}
						</label>
						{field.type === 'select' ? (
							<select
								{...register(field.name as keyof FormInput)}
								className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							>
								{field.options?.map(opt => (
									<option key={opt.value} value={opt.value}>
										{opt.label}
									</option>
								))}
							</select>
						) : (
							<input
								type={field.type}
								{...register(field.name as keyof FormInput)}
								className='mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500'
							/>
						)}
						{errors[field.name as keyof FormInput] && (
							<p className='mt-2 text-sm text-red-600'>
								{(errors[field.name as keyof FormInput] as any)?.message}
							</p>
						)}
					</div>
				))}
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
