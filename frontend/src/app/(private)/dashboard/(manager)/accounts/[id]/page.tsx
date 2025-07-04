'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
	useGetAccountById,
	useUpdateAccount,
	useDeleteAccount,
} from '@/Services/account-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { AccountForm } from '@/Components/Management/AccountForm'
import { CldImage } from 'next-cloudinary'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import ConfirmationModal from '@/Components/Common/ConfirmationModal'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'

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
	const queryClient = useQueryClient()
	const [isEditing, setIsEditing] = useState(false)
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [imageLoadError, setImageLoadError] = useState(false)

	const {
		data: account,
		isLoading,
		isError,
		refetch,
	} = useGetAccountById(id || '')
	const updateMutation = useUpdateAccount()
	const deleteMutation = useDeleteAccount()

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
				onSuccess: data => {
					console.log('✅ Update successful:', data)
					setIsEditing(false)

					// Invalidate and refetch account queries
					queryClient.invalidateQueries({ queryKey: ['account', id] })
					queryClient.invalidateQueries({ queryKey: ['accounts'] })
					refetch()

					toast.success('Account updated successfully')
				},
				onError: error => {
					console.error('❌ Error updating account:', error)
					toast.error('Failed to update account')
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
					setImageLoadError(false)
					refetch()
				},
				onError: error => {
					console.error('Error updating avatar:', error)
					toast.error('Failed to update avatar')
				},
			}
		)
	}

	const handleDelete = () => {
		if (!id) return

		deleteMutation.mutate(id, {
			onSuccess: () => {
				setIsDeleteModalOpen(false)
				router.push('/dashboard/accounts')
			},
			onError: error => {
				console.error('Failed to delete account:', error)
				toast.error('Failed to delete account')
			},
		})
	}

	const handlePaymentHistory = () => {
		router.push(`/dashboard/payments/${id}`)
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
				<div className='max-w-5xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<button
								onClick={() => router.push('/dashboard/accounts')}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
							>
								<ArrowLeftIcon className='w-5 h-5 text-gray-600' />
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
								<>
									<button
										onClick={handlePaymentHistory}
										className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
									>
										Payment History
									</button>
									<button
										onClick={() => setIsEditing(true)}
										className='px-4 py-2 text-sm font-medium text-white bg-accent hover:bg-accent/90 rounded-lg transition-colors'
									>
										Edit
									</button>
									<button
										onClick={() => setIsDeleteModalOpen(true)}
										className='px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors'
									>
										Delete
									</button>
								</>
							) : (
								<button
									onClick={() => setIsEditing(false)}
									className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'
								>
									Cancel
								</button>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Edit Modal */}
			{isEditing && (
				<div
					className='fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4'
					onClick={() => setIsEditing(false)}
				>
					<div
						className='bg-white rounded-xl border border-gray-200 max-w-3xl w-full max-h-[90vh] overflow-hidden'
						onClick={e => e.stopPropagation()}
					>
						<div className='p-6 max-h-[90vh] overflow-y-auto'>
							<h2 className='text-lg font-semibold text-gray-900 mb-6'>
								Edit Account Information
							</h2>
							<AccountForm
								id={account.id}
								onSave={handleSave}
								onCancel={() => setIsEditing(false)}
								isLoading={updateMutation.isPending}
							/>
						</div>
					</div>
				</div>
			)}

			{/* Content */}
			<div className='max-w-5xl mx-auto px-6 py-6'>
				{!isEditing && (
					<div className='space-y-6'>
						{/* Profile Overview */}
						<div className='bg-white rounded-xl border border-gray-200 p-6'>
							<div className='flex flex-col md:flex-row items-start md:items-center gap-6'>
								{/* Avatar */}
								<div className='relative group flex-shrink-0'>
									{account.avatarUrl && !imageLoadError ? (
										<CldImage
											src={account.avatarUrl}
											alt={`${account.firstName} ${account.lastName}`}
											width={96}
											height={96}
											className='rounded-full w-24 h-24 border-2 border-gray-200 object-cover'
											onError={() => setImageLoadError(true)}
										/>
									) : (
										<div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-200'>
											<span className='text-white text-xl font-medium'>
												{account.firstName?.charAt(0) || '?'}
												{account.lastName?.charAt(0) || ''}
											</span>
										</div>
									)}
									<button
										onClick={() => setIsAvatarModalOpen(true)}
										className='absolute -bottom-1 -right-1 bg-accent text-white p-1.5 rounded-full shadow-sm border-2 border-white hover:bg-accent/90 transition-colors'
									>
										<svg
											className='w-3 h-3'
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
								<div className='flex-1 min-w-0'>
									<h2 className='text-xl font-semibold text-gray-900 mb-2'>
										{account.firstName} {account.lastName}
									</h2>
									<div className='flex flex-col sm:flex-row sm:items-center gap-3 mb-4'>
										<div className='flex items-center gap-2 text-gray-600'>
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
											<span className='text-sm'>{account.email}</span>
										</div>
										{account.phoneNumber && (
											<div className='flex items-center gap-2 text-gray-600'>
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
												<span className='text-sm'>{account.phoneNumber}</span>
											</div>
										)}
									</div>
									<div className='flex flex-wrap gap-2'>
										<span
											className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md ${
												account.isDeleted
													? 'bg-red-50 text-red-700 border border-red-200'
													: 'bg-green-50 text-green-700 border border-green-200'
											}`}
										>
											<div
												className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
													account.isDeleted ? 'bg-red-500' : 'bg-green-500'
												}`}
											/>
											{account.isDeleted ? 'Inactive' : 'Active'}
										</span>
										{account.role?.name && (
											<span className='inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-blue-50 text-blue-700 border border-blue-200'>
												{account.role.name}
											</span>
										)}
										<span className='inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-gray-50 text-gray-700 border border-gray-200'>
											{account.gender ? 'Male' : 'Female'}
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Account Details */}
						<div className='bg-white rounded-xl border border-gray-200 p-6'>
							<h3 className='text-lg font-semibold text-gray-900 mb-4'>
								Account Information
							</h3>
							<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										First Name
									</label>
									<p className='text-gray-900'>
										{account.firstName || 'Not provided'}
									</p>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										Last Name
									</label>
									<p className='text-gray-900'>
										{account.lastName || 'Not provided'}
									</p>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										Email
									</label>
									<p className='text-gray-900 break-all'>{account.email}</p>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										Phone Number
									</label>
									<p className='text-gray-900'>
										{account.phoneNumber || 'Not provided'}
									</p>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										Date of Birth
									</label>
									<p className='text-gray-900'>
										{account.dateOfBirth
											? format(new Date(account.dateOfBirth), 'dd/MM/yyyy')
											: 'Not provided'}
									</p>
								</div>
								<div>
									<label className='block text-sm font-medium text-gray-500 mb-1'>
										Role
									</label>
									<p className='text-gray-900'>
										{account.role?.name || 'No role assigned'}
									</p>
								</div>
							</div>
						</div>

						{/* Professional Information */}
						{account.role?.name !== 'member' && account.staffInfo && (
							<div className='bg-white rounded-xl border border-gray-200 p-6'>
								<h3 className='text-lg font-semibold text-gray-900 mb-4'>
									Professional Information
								</h3>
								<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
									{account.staffInfo?.departmentName && (
										<div>
											<label className='block text-sm font-medium text-gray-500 mb-1'>
												Department
											</label>
											<p className='text-gray-900'>
												{account.staffInfo.departmentName}
											</p>
										</div>
									)}
									{account.staffInfo?.degree && (
										<div>
											<label className='block text-sm font-medium text-gray-500 mb-1'>
												Degree
											</label>
											<p className='text-gray-900'>
												{account.staffInfo.degree}
											</p>
										</div>
									)}
									{account.staffInfo?.yearOfExperience != null && (
										<div>
											<label className='block text-sm font-medium text-gray-500 mb-1'>
												Years of Experience
											</label>
											<p className='text-gray-900'>
												{account.staffInfo.yearOfExperience} years
											</p>
										</div>
									)}
									{account.staffInfo?.biography && (
										<div className='md:col-span-2'>
											<label className='block text-sm font-medium text-gray-500 mb-1'>
												Biography
											</label>
											<p className='text-gray-900 leading-relaxed'>
												{account.staffInfo.biography}
											</p>
										</div>
									)}
								</div>
							</div>
						)}
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title='Delete Account'
				message={`Are you sure you want to delete the account for ${account.firstName} ${account.lastName}? This action cannot be undone.`}
				confirmText='Delete Account'
				cancelText='Cancel'
				isDangerous={true}
				isLoading={deleteMutation.isPending}
			/>

			{/* Avatar Upload Modal */}
			{isAvatarModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4'>
						<div className='text-center mb-6'>
							<div className='w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-6 h-6 text-blue-600'
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
							</div>
							<h3 className='text-lg font-semibold text-gray-900 mb-2'>
								Update Avatar
							</h3>
							<p className='text-gray-600 text-sm'>
								Upload a new profile picture for this account
							</p>
						</div>
						<div className='space-y-3'>
							<CloudinaryButton
								onUploaded={handleAvatarUpload}
								uploadPreset='gencare'
								text='Upload New Image'
								className='w-full px-4 py-2.5 bg-accent hover:bg-accent/90 text-white rounded-lg font-medium transition-colors'
							/>
							<button
								onClick={() => setIsAvatarModalOpen(false)}
								className='w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium'
							>
								Cancel
							</button>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default AccountDetailPage
