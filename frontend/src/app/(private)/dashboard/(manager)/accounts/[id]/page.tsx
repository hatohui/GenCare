'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import { useGetAccountById, useUpdateAccount } from '@/Services/account-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { AccountForm } from '@/Components/Management/AccountForm'
import { CldImage } from 'next-cloudinary'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
const ArrowLeftIcon = ({ className }: { className?: string }) => (
	<svg
		className={className}
		fill='none'
		stroke='currentColor'
		viewBox='0 0 24 24'
	>
		<path
			strokeLinecap='round'
			strokeLinejoin='round'
			strokeWidth={2}
			d='M15 19l-7-7 7-7'
		/>
	</svg>
)

const AccountDetailPage = () => {
	const params = useParams()
	const id = params?.id && typeof params.id === 'string' ? params.id : null
	const router = useRouter()
	const [isEditing, setIsEditing] = useState(false)
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)

	const {
		data: account,
		isLoading,
		isError,
		refetch,
	} = useGetAccountById(id || '')
	const updateMutation = useUpdateAccount()

	if (!id) {
		router.push('/dashboard/accounts')
		return <div>Loading...</div>
	}

	if (isLoading) {
		return (
			<div className='h-full w-full flex items-center justify-center'>
				<LoadingIcon />
			</div>
		)
	}

	if (isError || !account) {
		return (
			<div className='h-full w-full flex items-center justify-center'>
				<div className='text-center'>
					<h2 className='text-xl font-semibold text-red-600 mb-2'>
						Error Loading Account
					</h2>
					<p className='text-gray-600 mb-4'>Unable to load account details</p>
					<button
						onClick={() => router.push('/dashboard/accounts')}
						className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
					>
						Back to Accounts
					</button>
				</div>
			</div>
		)
	}

	const handleSave = (formData: any) => {
		updateMutation.mutate(
			{ id, data: formData },
			{
				onSuccess: () => {
					setIsEditing(false)
					refetch()
				},
				onError: error => {
					console.error('Failed to update account:', error)
				},
			}
		)
	}

	const handleAvatarUpload = (url: string) => {
		if (!account || !id) return
		updateMutation.mutate(
			{ id, data: { account: { avatarUrl: url } } },
			{
				onSuccess: () => {
					setIsAvatarModalOpen(false)
					refetch()
				},
				onError: error => {
					console.error('Error updating avatar:', error)
				},
			}
		)
	}

	return (
		<motion.div
			className='h-full w-full flex flex-col'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
		>
			{/* Header */}
			<div className='flex items-center justify-between p-6 border-b border-gray-200'>
				<div className='flex items-center gap-3'>
					<button
						onClick={() => router.push('/dashboard/accounts')}
						className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
					>
						<ArrowLeftIcon className='w-5 h-5' />
					</button>
					<div>
						<h1 className='text-xl font-semibold text-gray-900'>
							{account.firstName} {account.lastName}
						</h1>
						<p className='text-sm text-gray-500'>{account.email}</p>
					</div>
				</div>
				<div className='flex items-center gap-2'>
					{!isEditing ? (
						<button
							onClick={() => setIsEditing(true)}
							className='px-4 py-2 bg-accent text-white rounded-lg hover:opacity-90 transition-opacity shadow-md hover:shadow-lg'
						>
							Edit Account
						</button>
					) : (
						<button
							onClick={() => setIsEditing(false)}
							className='px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors shadow-md'
						>
							Cancel
						</button>
					)}
				</div>
			</div>

			{/* Content */}
			<div className='flex-1 overflow-auto p-6'>
				{isEditing ? (
					<AccountForm
						initialData={account}
						onSave={handleSave}
						onCancel={() => setIsEditing(false)}
						isLoading={updateMutation.isPending}
					/>
				) : (
					<div className='max-w-4xl mx-auto'>
						{/* Avatar Section */}
						<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6'>
							<div className='flex flex-col md:flex-row items-center gap-6'>
								{/* Avatar */}
								<div className='relative group'>
									{account.avatarUrl ? (
										<CldImage
											src={account.avatarUrl}
											alt={`${account.firstName} ${account.lastName}`}
											width={120}
											height={120}
											className='rounded-full border-4 border-gray-100 group-hover:border-accent/30 transition-colors object-cover'
										/>
									) : (
										<div className='w-[120px] h-[120px] rounded-full bg-gradient-to-br from-accent to-accent/70 flex items-center justify-center border-4 border-gray-100 group-hover:border-accent/30 transition-colors'>
											<span className='text-white text-3xl font-bold'>
												{account.firstName?.charAt(0) || '?'}
												{account.lastName?.charAt(0) || ''}
											</span>
										</div>
									)}
									{/* Upload button overlay */}
									<button
										onClick={() => setIsAvatarModalOpen(true)}
										className='absolute bottom-0 right-0 bg-accent text-white p-2 rounded-full shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent/90'
									>
										<svg
											className='w-4 h-4'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z'
											/>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M15 13a3 3 0 11-6 0 3 3 0 016 0z'
											/>
										</svg>
									</button>
								</div>

								{/* Basic Info */}
								<div className='flex-1 text-center md:text-left'>
									<h2 className='text-2xl font-bold text-gray-900 mb-2'>
										{account.firstName} {account.lastName}
									</h2>
									<div className='flex flex-col md:flex-row gap-2 text-gray-600 mb-4'>
										<span className='flex items-center gap-1'>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207'
												/>
											</svg>
											{account.email}
										</span>
										<span className='flex items-center gap-1'>
											<svg
												className='w-4 h-4'
												fill='none'
												stroke='currentColor'
												viewBox='0 0 24 24'
											>
												<path
													strokeLinecap='round'
													strokeLinejoin='round'
													strokeWidth={2}
													d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
												/>
											</svg>
											{account.phoneNumber || 'Not provided'}
										</span>
									</div>
									<div className='flex flex-wrap gap-2'>
										<span
											className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
												account.isDeleted
													? 'bg-red-100 text-red-800'
													: 'bg-green-100 text-green-800'
											}`}
										>
											{account.isDeleted ? 'Deleted' : 'Active'}
										</span>
										<span className='inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-blue-100 text-blue-800'>
											{account.role?.name || 'No Role'}
										</span>
										<span className='inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-purple-100 text-purple-800'>
											{account.gender ? 'Male' : 'Female'}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Details Grid */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
							{/* Personal Information */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
									<svg
										className='w-5 h-5 text-accent'
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
									Personal Information
								</h3>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											First Name
										</label>
										<p className='text-gray-900 font-medium'>
											{account.firstName || 'Not provided'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											Last Name
										</label>
										<p className='text-gray-900 font-medium'>
											{account.lastName || 'Not provided'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											Date of Birth
										</label>
										<p className='text-gray-900 font-medium'>
											{account.dateOfBirth
												? new Date(account.dateOfBirth).toLocaleDateString(
														'en-US',
														{
															year: 'numeric',
															month: 'long',
															day: 'numeric',
														}
												  )
												: 'Not provided'}
										</p>
									</div>
								</div>
							</div>

							{/* Contact Information */}
							<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
									<svg
										className='w-5 h-5 text-accent'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
										/>
									</svg>
									Contact Information
								</h3>
								<div className='space-y-4'>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											Email Address
										</label>
										<p className='text-gray-900 font-medium break-all'>
											{account.email}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											Phone Number
										</label>
										<p className='text-gray-900 font-medium'>
											{account.phoneNumber || 'Not provided'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-1'>
											Role
										</label>
										<p className='text-gray-900 font-medium'>
											{account.role?.name || 'Not assigned'}
										</p>
									</div>
								</div>
							</div>

							{/* Professional Information - Only show if staff data exists */}
							{(account.degree ||
								account.yearOfExperience ||
								account.biography) && (
								<div className='bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2'>
									<h3 className='text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2'>
										<svg
											className='w-5 h-5 text-accent'
											fill='none'
											stroke='currentColor'
											viewBox='0 0 24 24'
										>
											<path
												strokeLinecap='round'
												strokeLinejoin='round'
												strokeWidth={2}
												d='M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z'
											/>
										</svg>
										Professional Information
									</h3>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{account.degree && (
											<div>
												<label className='block text-sm font-medium text-gray-500 mb-1'>
													Degree
												</label>
												<p className='text-gray-900 font-medium'>
													{account.degree}
												</p>
											</div>
										)}
										{account.yearOfExperience && (
											<div>
												<label className='block text-sm font-medium text-gray-500 mb-1'>
													Years of Experience
												</label>
												<p className='text-gray-900 font-medium'>
													{account.yearOfExperience} years
												</p>
											</div>
										)}
										{account.biography && (
											<div className='md:col-span-2'>
												<label className='block text-sm font-medium text-gray-500 mb-1'>
													Biography
												</label>
												<p className='text-gray-900 leading-relaxed'>
													{account.biography}
												</p>
											</div>
										)}
									</div>
								</div>
							)}
						</div>

						{/* Avatar Upload Modal */}
						{isAvatarModalOpen && (
							<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
								<motion.div
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className='bg-white rounded-xl p-6 shadow-2xl max-w-sm w-full mx-4'
								>
									<h3 className='text-lg font-semibold text-gray-900 mb-4'>
										Update Profile Picture
									</h3>
									<div className='space-y-4'>
										<CloudinaryButton
											onUploaded={handleAvatarUpload}
											uploadPreset='gencare'
											text='Upload New Picture'
											className='w-full bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors'
										/>
										<button
											onClick={() => setIsAvatarModalOpen(false)}
											className='w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors'
										>
											Cancel
										</button>
									</div>
								</motion.div>
							</div>
						)}
					</div>
				)}
			</div>
		</motion.div>
	)
}

export default AccountDetailPage
