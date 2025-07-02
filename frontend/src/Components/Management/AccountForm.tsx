'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { PutAccountRequest } from '@/Interfaces/Account/Schema/account'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'

interface AccountFormProps {
	initialData?: Account
	onSave: (data: PutAccountRequest) => void
	onCancel: () => void
	isLoading?: boolean
	isCreating?: boolean
}

export const AccountForm: React.FC<AccountFormProps> = ({
	initialData,
	onSave,
	onCancel,
	isLoading = false,
	isCreating = false,
}) => {
	const [formData, setFormData] = useState({
		firstName: initialData?.firstName || '',
		lastName: initialData?.lastName || '',
		email: initialData?.email || '',
		phoneNumber: initialData?.phoneNumber || '',
		gender: initialData?.gender ?? true,
		dateOfBirth: initialData?.dateOfBirth
			? new Date(initialData.dateOfBirth).toISOString().split('T')[0]
			: '',
		isDeleted: initialData?.isDeleted ?? false,
		avatarUrl: (initialData as any)?.avatarUrl || '',
		degree: (initialData as any)?.degree || '',
		yearOfExperience: (initialData as any)?.yearOfExperience || 0,
		biography: (initialData as any)?.biography || '',
	})

	const [errors, setErrors] = useState<Record<string, string>>({})
	const [uploadError, setUploadError] = useState<string>('')

	const handleAvatarUpload = (url: string, publicId: string) => {
		console.log('🖼️ Avatar uploaded:', { url, publicId })
		setFormData(prev => ({ ...prev, avatarUrl: url }))
		setUploadError('')
	}

	const handleUploadError = (error: string) => {
		console.error('❌ Avatar upload error:', error)
		setUploadError(error)
		toast.error(error)
	}
	const handleChange = (
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) => {
		const { name, value, type } = e.target
		setFormData(prev => ({
			...prev,
			[name]:
				type === 'checkbox'
					? (e.target as HTMLInputElement).checked
					: type === 'number'
					? Number(value)
					: value,
		}))
		if (errors[name]) {
			setErrors(prev => ({ ...prev, [name]: '' }))
		}
	}

	const validateForm = () => {
		const newErrors: Record<string, string> = {}

		if (!formData.firstName.trim()) {
			newErrors.firstName = 'First name is required'
		}
		if (!formData.lastName.trim()) {
			newErrors.lastName = 'Last name is required'
		}
		if (!formData.email.trim()) {
			newErrors.email = 'Email is required'
		} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
			newErrors.email = 'Email is invalid'
		}
		if (!formData.phoneNumber.trim()) {
			newErrors.phoneNumber = 'Phone number is required'
		}

		setErrors(newErrors)
		if (Object.values(newErrors).length > 0) {
			Object.values(newErrors).forEach(msg => toast.error(msg))
		}
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		const submitData: PutAccountRequest = {
			account: {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				gender: formData.gender,
				dateOfBirth: formData.dateOfBirth || undefined,
				isDeleted: formData.isDeleted,
				avatarUrl: formData.avatarUrl || undefined,
			},
		}

		if (formData.degree || formData.yearOfExperience || formData.biography) {
			submitData.staffInfo = {
				degree: formData.degree || undefined,
				yearOfExperience: formData.yearOfExperience || undefined,
				biography: formData.biography || undefined,
			}
		}
		onSave(submitData)
	}

	return (
		<motion.div
			className='max-w-2xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
				<h2 className='text-lg font-semibold text-gray-900 mb-6'>
					{isCreating ? 'Create New Account' : 'Edit Account'}
				</h2>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{/* Avatar Section */}
					<div className='flex flex-col items-center space-y-4 pb-6 border-b border-gray-200'>
						<div className='relative'>
							{formData.avatarUrl ? (
								<CldImage
									src={formData.avatarUrl}
									alt='Profile Avatar'
									className='w-24 h-24 rounded-full object-cover border-4 border-gray-200 shadow-lg'
									width={96}
									height={96}
								/>
							) : (
								<div className='w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-gray-200 shadow-lg'>
									<span className='text-gray-500 text-sm'>No Image</span>
								</div>
							)}
						</div>
						<CloudinaryButton
							onUploaded={handleAvatarUpload}
							onError={handleUploadError}
							uploadPreset='gencare'
							text='Upload Avatar'
							className='px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity text-sm shadow-md disabled:opacity-50'
						/>
						{/* Remove uploadError display, toast will show it */}
					</div>

					{/* Basic Information */}
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label
								htmlFor='firstName'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								First Name *
							</label>
							<input
								type='text'
								id='firstName'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.firstName ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter first name'
							/>
							{errors.firstName && (
								<p className='mt-1 text-sm text-red-600'>{errors.firstName}</p>
							)}
						</div>

						<div>
							<label
								htmlFor='lastName'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Last Name *
							</label>
							<input
								type='text'
								id='lastName'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.lastName ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter last name'
							/>
							{errors.lastName && (
								<p className='mt-1 text-sm text-red-600'>{errors.lastName}</p>
							)}
						</div>

						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Email *
							</label>
							<input
								type='email'
								id='email'
								name='email'
								value={formData.email}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.email ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter email address'
								disabled={!isCreating} // Email typically shouldn't be editable after creation
							/>
							{errors.email && (
								<p className='mt-1 text-sm text-red-600'>{errors.email}</p>
							)}
						</div>

						<div>
							<label
								htmlFor='phoneNumber'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Phone Number *
							</label>
							<input
								type='tel'
								id='phoneNumber'
								name='phoneNumber'
								value={formData.phoneNumber}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter phone number'
							/>
							{errors.phoneNumber && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.phoneNumber}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='gender'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Gender
							</label>
							<select
								id='gender'
								name='gender'
								value={formData.gender ? 'true' : 'false'}
								onChange={e =>
									setFormData(prev => ({
										...prev,
										gender: e.target.value === 'true',
									}))
								}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
							>
								<option value='true'>Male</option>
								<option value='false'>Female</option>
							</select>
						</div>

						<div>
							<label
								htmlFor='dateOfBirth'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Date of Birth
							</label>
							<input
								type='date'
								id='dateOfBirth'
								name='dateOfBirth'
								value={formData.dateOfBirth}
								onChange={handleChange}
								className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
							/>
						</div>
					</div>

					{/* Staff Information (if applicable) */}
					<div className='border-t border-gray-200 pt-6'>
						<h3 className='text-md font-medium text-gray-900 mb-4'>
							Staff Information
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label
									htmlFor='degree'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Degree
								</label>
								<input
									type='text'
									id='degree'
									name='degree'
									value={formData.degree}
									onChange={handleChange}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter degree/qualification'
								/>
							</div>

							<div>
								<label
									htmlFor='yearOfExperience'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Years of Experience
								</label>
								<input
									type='number'
									id='yearOfExperience'
									name='yearOfExperience'
									value={formData.yearOfExperience}
									onChange={handleChange}
									min='0'
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter years of experience'
								/>
							</div>

							<div className='md:col-span-2'>
								<label
									htmlFor='biography'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Biography
								</label>
								<textarea
									id='biography'
									name='biography'
									value={formData.biography}
									onChange={handleChange}
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter biography or professional summary'
								/>
							</div>
						</div>
					</div>

					{/* Status */}
					{!isCreating && (
						<div className='border-t border-gray-200 pt-6'>
							<div className='flex items-center'>
								<input
									type='checkbox'
									id='isDeleted'
									name='isDeleted'
									checked={formData.isDeleted}
									onChange={handleChange}
									className='h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded'
								/>
								<label
									htmlFor='isDeleted'
									className='ml-2 block text-sm text-gray-700'
								>
									Mark as deleted
								</label>
							</div>
						</div>
					)}

					{/* Form Actions */}
					<div className='flex justify-end gap-3 pt-6 border-t border-gray-200'>
						<button
							type='button'
							onClick={onCancel}
							className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
							disabled={isLoading}
						>
							Cancel
						</button>
						<button
							type='submit'
							disabled={isLoading}
							className='px-4 py-2 text-sm font-medium text-white bg-accent border border-transparent rounded-lg hover:opacity-90 focus:ring-2 focus:ring-accent focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-md'
						>
							{isLoading
								? 'Saving...'
								: isCreating
								? 'Create Account'
								: 'Save Changes'}
						</button>
					</div>
				</form>
			</div>
		</motion.div>
	)
}
