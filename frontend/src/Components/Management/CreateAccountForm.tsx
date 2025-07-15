'use client'

import React from 'react'
import { motion } from 'motion/react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
	CreateAccountRequest,
	createAccountSchema,
	CreateAccountFormData,
} from '@/Interfaces/Account/Schema/account'
import { useGetAllDepartments } from '@/Services/department-service'
import { useGetAllRoles } from '@/Services/role-service'

export interface CreateAccountFormProps {
	onSave: (data: CreateAccountRequest) => void
	onCancel: () => void
	isLoading?: boolean
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
	onSave,
	onCancel,
	isLoading = false,
}) => {
	const { data: departments } = useGetAllDepartments()
	const { data: roles } = useGetAllRoles()

	const availableRoles = roles?.filter(role => role.name !== 'admin') || []

	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<CreateAccountFormData>({
		resolver: zodResolver(createAccountSchema),
		defaultValues: {
			firstName: '',
			lastName: '',
			email: '',
			phoneNumber: '',
			gender: true,
			dateOfBirth: '',
			password: '',
			confirmPassword: '',
			roleId: '',
			degree: '',
			yearOfExperience: 0,
			biography: '',
			departmentId: '',
		},
	})

	// Watch roleId for conditional rendering
	const watchedRoleId = watch('roleId')
	const selectedRole =
		availableRoles.find(role => role.id === watchedRoleId)?.name || ''

	const onSubmit = (data: CreateAccountFormData) => {
		if (selectedRole !== 'member' && selectedRole !== '') {
			const staffErrors: Record<string, string> = {}

			if (!data.degree?.trim()) {
				staffErrors.degree = 'Degree is required for staff roles'
			}
			if (!data.departmentId?.trim()) {
				staffErrors.departmentId = 'Department is required for staff roles'
			}
			if ((data.yearOfExperience || 0) < 0) {
				staffErrors.yearOfExperience =
					'Years of experience must be non-negative'
			}
		}

		const submitData: any = {
			account: {
				firstName: data.firstName,
				lastName: data.lastName,
				email: data.email,
				phoneNumber: data.phoneNumber,
				gender: data.gender,
				password: data.password,
				dateOfBirth: data.dateOfBirth,
				roleId: data.roleId,
			},
		}

		if (selectedRole !== 'member') {
			submitData.staffInfo = {
				degree: data.degree || '',
				yearOfExperience: data.yearOfExperience || 0,
				biography: data.biography || '',
				departmentId: data.departmentId || '',
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
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
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
							{...register('firstName')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.firstName ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder='Enter first name'
						/>
						{errors.firstName && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.firstName.message}
							</p>
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
							{...register('lastName')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.lastName ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder='Enter last name'
						/>
						{errors.lastName && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.lastName.message}
							</p>
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
							{...register('email')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.email ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder='Enter email address'
						/>
						{errors.email && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.email.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='phoneNumber'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Phone Number
						</label>
						<input
							type='tel'
							id='phoneNumber'
							{...register('phoneNumber')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.phoneNumber ? 'border-red-500' : 'border-gray-300'
							}`}
							placeholder='Enter phone number'
						/>
						{errors.phoneNumber && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.phoneNumber.message}
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
							{...register('gender', {
								setValueAs: v => v === 'true',
							})}
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
							Date of Birth *
						</label>
						<input
							type='date'
							id='dateOfBirth'
							{...register('dateOfBirth')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.dateOfBirth && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.dateOfBirth.message}
							</p>
						)}
					</div>

					<div>
						<label
							htmlFor='roleId'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							Role *
						</label>
						<select
							id='roleId'
							{...register('roleId')}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.roleId ? 'border-red-500' : 'border-gray-300'
							}`}
						>
							<option value=''>Select a role</option>
							{availableRoles.map(role => (
								<option key={role.id} value={role.id}>
									{role.name}
								</option>
							))}
						</select>
						{errors.roleId && (
							<p className='mt-1 text-sm text-red-600'>
								{errors.roleId.message}
							</p>
						)}
					</div>
				</div>

				{/* Password Section */}
				<div className='border-t border-gray-200 pt-6'>
					<h3 className='text-md font-medium text-gray-900 mb-4'>
						Security Information
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label
								htmlFor='password'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Password *
							</label>
							<input
								type='password'
								id='password'
								{...register('password')}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.password ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter password'
							/>
							{errors.password && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.password.message}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='confirmPassword'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Confirm Password *
							</label>
							<input
								type='password'
								id='confirmPassword'
								{...register('confirmPassword')}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Confirm password'
							/>
							{errors.confirmPassword && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.confirmPassword.message}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Staff Information - Only show for NON-member role (FIXED LOGIC) */}
				{selectedRole !== 'member' && selectedRole !== '' && (
					<div className='border-t border-gray-200 pt-6'>
						<h3 className='text-md font-medium text-gray-900 mb-2'>
							Staff Information *
						</h3>
						<p className='text-sm text-gray-600 mb-4'>
							All fields are required for staff roles.
						</p>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label
									htmlFor='degree'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Degree *
								</label>
								<input
									type='text'
									id='degree'
									{...register('degree')}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
										errors.degree ? 'border-red-500' : 'border-gray-300'
									}`}
									placeholder='Enter degree/qualification'
								/>
								{errors.degree && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.degree.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor='yearOfExperience'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Years of Experience *
								</label>
								<input
									type='number'
									id='yearOfExperience'
									{...register('yearOfExperience')}
									min='0'
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
										errors.yearOfExperience
											? 'border-red-500'
											: 'border-gray-300'
									}`}
									placeholder='Enter years of experience'
								/>
								{errors.yearOfExperience && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.yearOfExperience.message}
									</p>
								)}
							</div>

							<div>
								<label
									htmlFor='departmentId'
									className='block text-sm font-medium text-gray-700 mb-1'
								>
									Department *
								</label>
								<select
									id='departmentId'
									{...register('departmentId')}
									className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
										errors.departmentId ? 'border-red-500' : 'border-gray-300'
									}`}
								>
									<option value=''>Select a department</option>
									{departments?.map(department => (
										<option key={department.id} value={department.id}>
											{department.name}
										</option>
									))}
								</select>
								{errors.departmentId && (
									<p className='mt-1 text-sm text-red-600'>
										{errors.departmentId.message}
									</p>
								)}
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
									{...register('biography')}
									rows={4}
									className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
									placeholder='Enter biography or professional summary'
								/>
							</div>
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
						{isLoading ? 'Creating...' : 'Create Account'}
					</button>
				</div>
			</form>
		</motion.div>
	)
}

export default CreateAccountForm
