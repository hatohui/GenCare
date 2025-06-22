import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import React, { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { PencilSquareSVG } from '../SVGs'
import { CloudinaryButton } from '../CloudinaryButton'
import { useUpdateAccount } from '@/Services/account-service'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({
	firstName: z.string().min(1, 'First name is required'),
	lastName: z.string().min(1, 'Last name is required'),
	email: z.string().email(),
	phoneNumber: z.string().optional(),
	dateOfBirth: z.string().optional(),
	gender: z.boolean(),
	avatarUrl: z.string().url().optional(),
})

type FormData = z.infer<typeof schema>

const Profile = ({ data }: { data?: StaffAccount }) => {
	const updateAccount = useUpdateAccount(data?.id ?? '')
	const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl)
	const [isModalOpen, setIsModalOpen] = useState(false)

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<FormData>({
		resolver: zodResolver(schema),
		defaultValues: {
			firstName: data?.firstName ?? '',
			lastName: data?.lastName ?? '',
			email: data?.email ?? '',
			phoneNumber: data?.phoneNumber ?? '',
			dateOfBirth: data?.dateOfBirth ?? '',
			gender: data?.gender ?? true,
			avatarUrl: data?.avatarUrl ?? '',
		},
	})

	const onSubmit = (formData: FormData) => {
		updateAccount.mutate(
			{ account: { ...data, ...formData } },
			{
				onSuccess: () => {
					setAvatarUrl(formData.avatarUrl) // ensure avatar updates live
					setIsModalOpen(false)
				},
			}
		)
	}

	const handleUpload = (url: string) => {
		setValue('avatarUrl', url) // update form field
		setAvatarUrl(url) // update display immediately
	}

	return (
		<div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-6 shadow-secondary/10'>
			<h1 className='text-2xl font-bold col-span-4 text-center text-main'>
				Account Profile
			</h1>

			<div className='col-span-1'>
				<div className='relative group w-24 h-24 mx-auto'>
					{avatarUrl ? (
						<CldImage
							src={avatarUrl}
							alt='avatar'
							className='rounded-full w-full h-full object-cover border-4 border-gray-300'
							width={96}
							height={96}
						/>
					) : (
						<div className='w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-gray-300'>
							No Image
						</div>
					)}

					{/* Hover overlay */}
					<div className='absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer'>
						<CloudinaryButton
							onUploaded={handleUpload}
							uploadPreset='gencare'
							text=''
							className='absolute inset-0 w-full h-full'
						/>
						<PencilSquareSVG className='text-white size-8 pointer-events-none' />
					</div>
				</div>
			</div>

			<div className='col-span-3 flex flex-col gap-2 py-5'>
				<p>
					<strong>Full Name:</strong> {data?.firstName} {data?.lastName}
				</p>
				<p>
					<strong>Email:</strong> {data?.email}
				</p>
				<p>
					<strong>Phone:</strong> {data?.phoneNumber || 'N/A'}
				</p>
				<p>
					<strong>Role:</strong> {data?.role.name}
				</p>
				<p>
					<strong>Date of Birth:</strong> {data?.dateOfBirth}
				</p>
				<p>
					<strong>Gender:</strong> {data?.gender ? 'Male' : 'Female'}
				</p>
				<button
					onClick={() => setIsModalOpen(true)}
					className='mt-4 bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 w-fit'
				>
					Edit
				</button>
			</div>

			{isModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-lg'>
						<h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
						<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
							<div className='grid grid-cols-2 gap-4'>
								<div>
									<label>First Name</label>
									<input {...register('firstName')} className='input' />
									{errors.firstName && (
										<p className='text-red-500'>{errors.firstName.message}</p>
									)}
								</div>
								<div>
									<label>Last Name</label>
									<input {...register('lastName')} className='input' />
									{errors.lastName && (
										<p className='text-red-500'>{errors.lastName.message}</p>
									)}
								</div>
								<div className='col-span-2'>
									<label>Email</label>
									<input {...register('email')} className='input' />
									{errors.email && (
										<p className='text-red-500'>{errors.email.message}</p>
									)}
								</div>
								<div className='col-span-2'>
									<label>Phone</label>
									<input {...register('phoneNumber')} className='input' />
								</div>
								<div className='col-span-2'>
									<label>Date of Birth</label>
									<input
										type='date'
										{...register('dateOfBirth')}
										className='input'
									/>
								</div>
								<div className='col-span-2'>
									<label>Gender</label>
									<select
										{...register('gender', { setValueAs: v => v === 'true' })}
										className='input'
									>
										<option value='true'>Male</option>
										<option value='false'>Female</option>
									</select>
								</div>
								<div className='col-span-2'>
									<label>Avatar</label>
									<CloudinaryButton
										onUploaded={handleUpload}
										uploadPreset='gencare'
										text='Upload Image'
										className='bg-gray-200 px-4 py-2 rounded'
									/>
								</div>
							</div>

							<div className='flex justify-end gap-2 mt-4'>
								<button
									type='button'
									onClick={() => setIsModalOpen(false)}
									className='px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500'
								>
									Cancel
								</button>
								<button
									type='submit'
									className='px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600'
								>
									Save
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	)
}

export default Profile
