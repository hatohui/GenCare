'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	PutAccountRequest,
	accountFormSchema,
	accountEditSchema,
	AccountFormData,
	AccountEditData,
} from '@/Interfaces/Account/Schema/account'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import { CldImage } from 'next-cloudinary'
import { toast } from 'react-hot-toast'
import { formatDateForInput } from '@/Utils/dateTime'
import { useGetAllDepartments } from '@/Services/department-service'
import { useGetAllRoles } from '@/Services/role-service'
import { useGetAccountById } from '@/Services/account-service'

interface AccountFormProps {
	id: string
	onSave: (data: PutAccountRequest) => void
	onCancel: () => void
	isLoading?: boolean
	isCreating?: boolean
}

export const AccountForm: React.FC<AccountFormProps> = ({
	id,
	onSave,
	onCancel,
	isLoading = false,
	isCreating = false,
}) => {
	const { data: departments, isLoading: departmentsLoading } =
		useGetAllDepartments()
	const { data: roles, isLoading: rolesLoading } = useGetAllRoles()
	const { data: initialData } = useGetAccountById(id)

	const [avatarUrl, setAvatarUrl] = useState(initialData?.avatarUrl || '')
	const [selectedRole, setSelectedRole] = useState(() => {
		// For editing, try to find the role ID by matching role name with available roles
		if (initialData?.role?.name && !isCreating) {
			// We'll set this properly once roles are loaded in the useEffect
			return ''
		}
		return ''
	})

	const {
		register,
		handleSubmit,
		formState: { errors },
		setValue,
		reset,
	} = useForm<AccountFormData | AccountEditData>({
		resolver: zodResolver(isCreating ? accountFormSchema : accountEditSchema),
		defaultValues: {
			firstName: initialData?.firstName || '',
			lastName: initialData?.lastName || '',
			email: initialData?.email || '',
			phoneNumber: initialData?.phoneNumber || '',
			gender: initialData?.gender ?? true,
			dateOfBirth: initialData?.dateOfBirth
				? formatDateForInput(initialData.dateOfBirth)
				: '',
			isDeleted: initialData?.isDeleted ?? false,
			avatarUrl: initialData?.avatarUrl || '',
			degree: initialData?.staffInfo?.degree || '',
			yearOfExperience: initialData?.staffInfo?.yearOfExperience || 0,
			biography: initialData?.staffInfo?.biography || '',
			departmentId: initialData?.staffInfo?.departmentId || '',
			roleId: '',
		},
	})

	// Reset form when initial data changes (important for editing)
	React.useEffect(() => {
		if (initialData && !isCreating) {
			console.log('🔧 Resetting form with initial data:', initialData)
			console.log(
				'🔧 Staff info department ID:',
				initialData.staffInfo?.departmentId
			)

			const resetData = {
				firstName: initialData.firstName || '',
				lastName: initialData.lastName || '',
				email: initialData.email || '',
				phoneNumber: initialData.phoneNumber || '',
				gender: initialData.gender ?? true,
				dateOfBirth: initialData.dateOfBirth
					? formatDateForInput(initialData.dateOfBirth)
					: '',
				isDeleted: initialData.isDeleted ?? false,
				avatarUrl: initialData.avatarUrl || '',
				degree: initialData.staffInfo?.degree || '',
				yearOfExperience: initialData.staffInfo?.yearOfExperience || 0,
				biography: initialData.staffInfo?.biography || '',
				departmentId: initialData.staffInfo?.departmentId || '',
				roleId: '',
			}

			console.log('🔧 Reset data object:', resetData)
			reset(resetData)
		}
	}, [initialData, reset, isCreating])

	React.useEffect(() => {
		if (roles && initialData?.role?.name && !isCreating) {
			const currentRoleId = roles.find(
				role => role.name === initialData.role?.name
			)?.id
			if (currentRoleId) {
				setSelectedRole(currentRoleId)
				console.log(
					'🔧 Role set to:',
					currentRoleId,
					'for role name:',
					initialData.role.name
				)
			}
		}
	}, [roles, initialData?.role?.name, isCreating])

	React.useEffect(() => {
		console.log('🔧 Initial data received:', initialData)
		if (initialData?.staffInfo) {
			console.log('🔧 Staff info in initial data:', initialData.staffInfo)
			console.log(
				'🔧 Department ID from initial data:',
				initialData.staffInfo.departmentId
			)
		}
		if (departments) {
			console.log('🔧 Available departments:', departments)
		}
	}, [initialData, departments])

	const currentRole = roles?.find(role => role.id === selectedRole)

	const isStaffRole =
		currentRole &&
		currentRole.name.toLowerCase() !== 'member' &&
		selectedRole !== ''

	console.log('🔄 Current role:', currentRole)

	const handleAvatarUpload = (url: string) => {
		setAvatarUrl(url)
		setValue('avatarUrl', url)
	}

	const handleUploadError = (error: string) => {
		console.error('Avatar upload error:', error)
		toast.error(error)
	}

	const onSubmit = (data: AccountFormData | AccountEditData) => {
		console.log('🔧 AccountForm onSubmit - Form data:', data)
		console.log('🔧 AccountForm onSubmit - Selected role:', selectedRole)
		console.log('🔧 AccountForm onSubmit - Department ID:', data.departmentId)
		console.log('🔧 AccountForm onSubmit - Is staff role:', isStaffRole)

		const submitData: PutAccountRequest = {
			account: {
				firstName: data.firstName,
				lastName: data.lastName,
				phoneNumber: data.phoneNumber || undefined,
				gender: data.gender,
				dateOfBirth: data.dateOfBirth || undefined,
				isDeleted: data.isDeleted,
				avatarUrl: avatarUrl || undefined,
				roleId: selectedRole || undefined,
			},
		}

		// Always include staffInfo for staff roles, even if some fields are empty
		if (
			isStaffRole ||
			data.degree ||
			data.yearOfExperience ||
			data.biography ||
			data.departmentId
		) {
			submitData.staffInfo = {
				degree: data.degree || undefined,
				yearOfExperience: data.yearOfExperience || undefined,
				biography: data.biography || undefined,
				departmentId: data.departmentId || undefined,
			}
		}

		console.log('🔧 AccountForm onSubmit - Final submit data:', submitData)
		onSave(submitData)
	}

	return (
		<motion.div
			className='w-full max-w-3xl mx-auto'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			<div className='bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100'>
				<div className='main-gradient-bg px-6 py-5'>
					<h2 className='text-lg font-semibold text-white flex items-center gap-2'>
						<svg
							className='w-5 h-5'
							fill='none'
							stroke='currentColor'
							viewBox='0 0 24 24'
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth={2}
								d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
							/>
						</svg>
						{isCreating ? 'Create New Account' : 'Edit Account'}
					</h2>
					<p className='text-white/70 text-sm mt-1 font-light'>
						{isCreating
							? 'Add a new team member to the system'
							: 'Update account information and settings'}
					</p>
				</div>

				<div className='p-6'>
					<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
						{/* Avatar Section */}
						<div className='flex flex-col items-center space-y-4 pb-6 border-b border-gray-100'>
							<div className='relative group'>
								{avatarUrl ? (
									<CldImage
										src={avatarUrl}
										alt='Profile Avatar'
										className='w-24 h-24 rounded-full object-cover shadow-lg ring-2 ring-gray-100'
										width={96}
										height={96}
									/>
								) : (
									<div className='w-24 h-24 rounded-full bg-gray-50 flex items-center justify-center shadow-lg ring-2 ring-gray-100'>
										<svg
											className='w-8 h-8 text-gray-400'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={1.5}
												d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
											/>
										</svg>
									</div>
								)}
							</div>
							<CloudinaryButton
								onUploaded={handleAvatarUpload}
								onError={handleUploadError}
								uploadPreset='gencare'
								text={avatarUrl ? 'Change Avatar' : 'Upload Avatar'}
								className='px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors text-sm font-medium'
							/>
						</div>
						{/* Basic Information */}
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label
									htmlFor='firstName'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									First Name *
								</label>
								<input
									type='text'
									id='firstName'
									{...register('firstName')}
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
										errors.firstName
											? 'border-red-300 bg-red-50'
											: 'border-gray-200 bg-gray-50'
									}`}
									placeholder='Enter first name'
								/>
								<div className='mt-1 h-5'>
									{errors.firstName && (
										<p className='text-sm text-red-500'>
											{errors.firstName.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='lastName'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Last Name *
								</label>
								<input
									type='text'
									id='lastName'
									{...register('lastName')}
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
										errors.lastName
											? 'border-red-300 bg-red-50'
											: 'border-gray-200 bg-gray-50'
									}`}
									placeholder='Enter last name'
								/>
								<div className='mt-1 h-5'>
									{errors.lastName && (
										<p className='text-sm text-red-500'>
											{errors.lastName.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='email'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Email *
								</label>
								<input
									type='email'
									id='email'
									{...register('email')}
									className={`w-full px-3 py-2.5 border rounded-lg transition-colors ${
										!isCreating
											? 'border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed'
											: errors.email
											? 'border-red-300 bg-red-50 focus:ring-2 focus:ring-accent/20 focus:border-accent'
											: 'border-gray-200 bg-gray-50 focus:ring-2 focus:ring-accent/20 focus:border-accent'
									}`}
									placeholder='Enter email address'
									disabled={!isCreating}
								/>
								<div className='mt-1 h-5'>
									{errors.email && (
										<p className='text-sm text-red-500'>
											{errors.email.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='phoneNumber'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Phone Number
								</label>
								<input
									type='tel'
									id='phoneNumber'
									{...register('phoneNumber')}
									className={`w-full px-3 py-2.5 border rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors ${
										errors.phoneNumber
											? 'border-red-300 bg-red-50'
											: 'border-gray-200 bg-gray-50'
									}`}
									placeholder='Enter phone number'
								/>
								<div className='mt-1 h-5'>
									{errors.phoneNumber && (
										<p className='text-sm text-red-500'>
											{errors.phoneNumber.message}
										</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='gender'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Gender
								</label>
								<select
									id='gender'
									{...register('gender', {
										setValueAs: value => value === 'true',
									})}
									className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
								>
									<option value='true'>Male</option>
									<option value='false'>Female</option>
								</select>
								<div className='mt-1 h-5'></div>
							</div>

							<div>
								<label
									htmlFor='roleId'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Role
								</label>
								<select
									id='roleId'
									value={selectedRole}
									onChange={e => {
										const value = e.target.value
										setSelectedRole(value)
										console.log('🔄 Role changed to:', value)
									}}
									className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
								>
									<option value=''>
										{rolesLoading ? 'Loading roles...' : 'Select a role'}
									</option>
									{roles &&
										roles
											.filter(role => role.name.toLowerCase() !== 'admin')
											.map(role => (
												<option key={role.id} value={role.id}>
													{role.name}
												</option>
											))}
								</select>
								<div className='mt-1 h-5'>
									{!selectedRole && (
										<p className='text-sm text-red-500'>Role is required</p>
									)}
								</div>
							</div>

							<div>
								<label
									htmlFor='dateOfBirth'
									className='block text-sm font-medium text-gray-900 mb-2'
								>
									Date of Birth
								</label>
								<input
									type='date'
									id='dateOfBirth'
									{...register('dateOfBirth')}
									className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
								/>
								<div className='mt-1 h-5'></div>
							</div>
						</div>
						{/* Staff Information (only for non-member roles) */}
						<div className='border-t border-gray-100 pt-6 min-h-[200px]'>
							{isStaffRole ? (
								<>
									<h3 className='text-md font-medium text-gray-900 mb-4'>
										Staff Information
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label
												htmlFor='degree'
												className='block text-sm font-medium text-gray-900 mb-2'
											>
												Degree
											</label>
											<input
												type='text'
												id='degree'
												{...register('degree')}
												className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
												placeholder='Enter degree/qualification'
											/>
											<div className='mt-1 h-5'></div>
										</div>

										<div>
											<label
												htmlFor='yearOfExperience'
												className='block text-sm font-medium text-gray-900 mb-2'
											>
												Years of Experience
											</label>
											<input
												type='number'
												id='yearOfExperience'
												{...register('yearOfExperience')}
												min='0'
												className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
												placeholder='Enter years of experience'
											/>
											<div className='mt-1 h-5'>
												{errors.yearOfExperience && (
													<p className='text-sm text-red-500'>
														{errors.yearOfExperience.message}
													</p>
												)}
											</div>
										</div>

										<div>
											<label
												htmlFor='departmentId'
												className='block text-sm font-medium text-gray-900 mb-2'
											>
												Department
											</label>
											<select
												id='departmentId'
												{...register('departmentId')}
												className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
											>
												<option value=''>
													{departmentsLoading
														? 'Loading departments...'
														: 'Select a department'}
												</option>
												{departments &&
													departments.map(department => (
														<option key={department.id} value={department.id}>
															{department.name}
														</option>
													))}
											</select>
											<div className='mt-1 h-5'>
												{errors.departmentId && (
													<p className='text-sm text-red-500'>
														{errors.departmentId.message}
													</p>
												)}
											</div>
										</div>

										<div className='md:col-span-2'>
											<label
												htmlFor='biography'
												className='block text-sm font-medium text-gray-900 mb-2'
											>
												Biography
											</label>
											<textarea
												id='biography'
												{...register('biography')}
												rows={4}
												className='w-full px-3 py-2.5 border border-gray-200 bg-gray-50 rounded-lg focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors'
												placeholder='Enter biography or professional summary'
											/>
										</div>
									</div>
								</>
							) : (
								<div className='flex items-center justify-center text-gray-500 py-8'>
									<span>
										Staff information will appear when a staff role is selected
									</span>
								</div>
							)}
						</div>
						{/* Status */}
						{!isCreating && (
							<div className='border-t border-gray-100 pt-6'>
								<div className='flex items-center'>
									<input
										type='checkbox'
										id='isDeleted'
										{...register('isDeleted')}
										className='h-4 w-4 text-accent focus:ring-accent focus:ring-2 border-gray-300 rounded'
									/>
									<label
										htmlFor='isDeleted'
										className='ml-2 block text-sm text-gray-900'
									>
										Mark as deleted
									</label>
								</div>
							</div>
						)}{' '}
						{/* Form Actions */}
						<div className='flex justify-end gap-3 pt-6 border-t border-gray-100'>
							<button
								type='button'
								onClick={onCancel}
								className='px-6 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50'
								disabled={isLoading}
							>
								Cancel
							</button>
							<button
								type='submit'
								disabled={isLoading}
								className='px-6 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors disabled:opacity-50 min-w-[120px]'
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
			</div>
		</motion.div>
	)
}
