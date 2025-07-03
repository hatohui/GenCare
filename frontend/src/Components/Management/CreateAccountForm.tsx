'use client'

import React, { useState } from 'react'
import { motion } from 'motion/react'
import { PostAccountRequest } from '@/Interfaces/Account/Schema/account'

interface CreateAccountFormProps {
	onSave: (data: PostAccountRequest) => void
	onCancel: () => void
	isLoading?: boolean
}

export const CreateAccountForm: React.FC<CreateAccountFormProps> = ({
	onSave,
	onCancel,
	isLoading = false,
}) => {
	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		email: '',
		phoneNumber: '',
		gender: true,
		dateOfBirth: '',
		password: '',
		confirmPassword: '',
		roleId: '', // Add role selection
		degree: '',
		yearOfExperience: 0,
		biography: '',
		department: '',
	})

	const [errors, setErrors] = useState<Record<string, string>>({})

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
		// Clear error when user starts typing
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
		if (!formData.password.trim()) {
			newErrors.password = 'Password is required'
		} else if (formData.password.length < 6) {
			newErrors.password = 'Password must be at least 6 characters'
		}
		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Passwords do not match'
		}
		if (!formData.roleId.trim()) {
			newErrors.roleId = 'Role is required'
		}
		if (!formData.dateOfBirth.trim()) {
			newErrors.dateOfBirth = 'Date of birth is required'
		}

		// Validate staff info if any field is provided
		const hasStaffInfo =
			formData.degree ||
			formData.yearOfExperience > 0 ||
			formData.biography ||
			formData.department
		if (hasStaffInfo) {
			if (!formData.degree.trim()) {
				newErrors.degree = 'Degree is required when providing staff information'
			}
			if (formData.yearOfExperience <= 0) {
				newErrors.yearOfExperience =
					'Years of experience must be greater than 0'
			}
			if (!formData.department.trim()) {
				newErrors.department =
					'Department is required when providing staff information'
			}
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!validateForm()) return

		// Use current frontend type structure with manual roleId addition
		const submitData: any = {
			account: {
				firstName: formData.firstName,
				lastName: formData.lastName,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				gender: formData.gender,
				password: formData.password,
				dateOfBirth: formData.dateOfBirth, // Always required now
				roleId: formData.roleId, // Manually add roleId
			},
		}

		// Only include staffInfo if ALL required fields are present
		const hasCompleteStaffInfo =
			formData.degree.trim() &&
			formData.yearOfExperience > 0 &&
			formData.department.trim()

		if (hasCompleteStaffInfo) {
			submitData.staffInfo = {
				degree: formData.degree,
				yearOfExperience: formData.yearOfExperience,
				biography: formData.biography || '',
			}
			submitData.department = formData.department // This will map to departmentId on the backend
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
			<form onSubmit={handleSubmit} className='space-y-6'>
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
							<p className='mt-1 text-sm text-red-600'>{errors.phoneNumber}</p>
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
							Date of Birth *
						</label>
						<input
							type='date'
							id='dateOfBirth'
							name='dateOfBirth'
							value={formData.dateOfBirth}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
							}`}
						/>
						{errors.dateOfBirth && (
							<p className='mt-1 text-sm text-red-600'>{errors.dateOfBirth}</p>
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
							name='roleId'
							value={formData.roleId}
							onChange={handleChange}
							className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
								errors.roleId ? 'border-red-500' : 'border-gray-300'
							}`}
						>
							<option value=''>Select a role</option>
							<option value='admin'>Admin</option>
							<option value='manager'>Manager</option>
							<option value='staff'>Staff</option>
							<option value='consultant'>Consultant</option>
							<option value='member'>Member</option>
						</select>
						{errors.roleId && (
							<p className='mt-1 text-sm text-red-600'>{errors.roleId}</p>
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
								name='password'
								value={formData.password}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.password ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter password'
							/>
							{errors.password && (
								<p className='mt-1 text-sm text-red-600'>{errors.password}</p>
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
								name='confirmPassword'
								value={formData.confirmPassword}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Confirm password'
							/>
							{errors.confirmPassword && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.confirmPassword}
								</p>
							)}
						</div>
					</div>
				</div>

				{/* Staff Information (Optional) */}
				<div className='border-t border-gray-200 pt-6'>
					<h3 className='text-md font-medium text-gray-900 mb-2'>
						Staff Information (Optional)
					</h3>
					<p className='text-sm text-gray-600 mb-4'>
						If you provide staff information, all fields marked with * are
						required.
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
								name='degree'
								value={formData.degree}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.degree ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter degree/qualification'
							/>
							{errors.degree && (
								<p className='mt-1 text-sm text-red-600'>{errors.degree}</p>
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
								name='yearOfExperience'
								value={formData.yearOfExperience}
								onChange={handleChange}
								min='1'
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.yearOfExperience ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter years of experience'
							/>
							{errors.yearOfExperience && (
								<p className='mt-1 text-sm text-red-600'>
									{errors.yearOfExperience}
								</p>
							)}
						</div>

						<div>
							<label
								htmlFor='department'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								Department *
							</label>
							<input
								type='text'
								id='department'
								name='department'
								value={formData.department}
								onChange={handleChange}
								className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
									errors.department ? 'border-red-500' : 'border-gray-300'
								}`}
								placeholder='Enter department ID'
							/>
							{errors.department && (
								<p className='mt-1 text-sm text-red-600'>{errors.department}</p>
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
						className='px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isLoading ? 'Creating...' : 'Create Account'}
					</button>
				</div>
			</form>
		</motion.div>
	)
}

export default CreateAccountForm
