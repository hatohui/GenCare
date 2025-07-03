'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
import {
	useGetAccountById,
	useUpdateAccount,
	useDeleteAccount,
} from '@/Services/account-service'
import { useGetAllDepartments } from '@/Services/department-service'
import { useGetAllRoles } from '@/Services/role-service'
import LoadingIcon from '@/Components/LoadingIcon'
import { AccountForm } from '@/Components/Management/AccountForm'
import { CldImage } from 'next-cloudinary'
import { CloudinaryButton } from '@/Components/CloudinaryButton'
import ConfirmationModal from '@/Components/Common/ConfirmationModal'
import { format } from 'date-fns'
import toast from 'react-hot-toast'

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
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [imageLoadError, setImageLoadError] = useState(false)

	const {
		data: account,
		isLoading,
		isError,
		refetch,
	} = useGetAccountById(id || '')
	const { data: departments } = useGetAllDepartments()
	const { data: roles } = useGetAllRoles()
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
				onSuccess: () => {
					setIsEditing(false)
					refetch()
				},
				onError: error => {
					console.error('Error updating account:', error)
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
		<motion.div
			className='min-h-screen bg-general'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className='bg-white border-b border-gray-200 sticky top-0 z-10'>
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-4'>
							<motion.button
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
								onClick={() => router.push('/dashboard/accounts')}
								className='p-2 hover:bg-gray-100 rounded-lg transition-colors'
							>
								<ArrowLeftIcon className='w-5 h-5 text-gray-600' />
							</motion.button>
							<div>
								<h1 className='text-2xl font-bold text-gray-900'>
									{account.firstName} {account.lastName}
								</h1>
								<p className='text-gray-600 text-sm'>{account.email}</p>
							</div>
						</div>
						<div className='flex items-center gap-2'>
							{!isEditing ? (
								<>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handlePaymentHistory}
										className='px-4 py-2 text-main border border-main/20 rounded-lg hover:bg-main/5 transition-all duration-200 font-medium text-sm'
									>
										Lịch sử thanh toán
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsEditing(true)}
										className='px-4 py-2 bg-main text-white rounded-lg hover:bg-main/90 transition-all duration-200 font-medium text-sm'
									>
										Chỉnh sửa
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsDeleteModalOpen(true)}
										className='px-4 py-2 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-all duration-200 font-medium text-sm'
									>
										Xóa
									</motion.button>
								</>
							) : (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setIsEditing(false)}
									className='px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium text-sm'
								>
									Hủy
								</motion.button>
							)}
						</div>
					</div>
				</div>
			</div>
			{/* Edit Modal */}
			{isEditing && (
				<div
					className='fixed inset-0 bg-black/50 backdrop-blur-[6px] flex items-center justify-center z-50 p-4'
					onClick={() => setIsEditing(false)}
				>
					<motion.div
						className='bg-white rounded-xl border border-gray-200 max-w-4xl w-full max-h-[90vh] overflow-hidden'
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 0.95 }}
						transition={{ duration: 0.2 }}
						onClick={e => e.stopPropagation()}
					>
						<div className='p-6 max-h-[90vh] overflow-y-auto'>
							<h2 className='text-lg font-semibold text-gray-900 mb-6'>
								Chỉnh sửa thông tin tài khoản
							</h2>
							<AccountForm
								initialData={account}
								onSave={handleSave}
								onCancel={() => setIsEditing(false)}
								isLoading={updateMutation.isPending}
								departments={departments || []}
								roles={roles || []}
							/>
						</div>
					</motion.div>
				</div>
			)}

			{/* Content */}
			<div className='max-w-7xl mx-auto px-6 py-6'>
				{!isEditing && (
					<div className='space-y-6'>
						{/* Avatar Section */}
						<motion.div
							className='bg-white rounded-xl border border-gray-200'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.1 }}
						>
							<div className='p-6'>
								<h2 className='text-lg font-semibold text-gray-900 mb-6'>
									Ảnh đại diện
								</h2>
								<div className='flex flex-col md:flex-row items-center gap-6'>
									{/* Avatar */}
									<div className='relative group'>
										{account.avatarUrl && !imageLoadError ? (
											<CldImage
												src={account.avatarUrl}
												alt={`${account.firstName} ${account.lastName}`}
												width={120}
												height={120}
												className='rounded-full border-2 border-gray-200 group-hover:border-main transition-all duration-200 object-cover'
												onError={() => setImageLoadError(true)}
											/>
										) : (
											<div className='w-[120px] h-[120px] rounded-full bg-main flex items-center justify-center border-2 border-gray-200 group-hover:border-main transition-all duration-200'>
												<span className='text-white text-3xl font-semibold'>
													{account.firstName?.charAt(0) || '?'}
													{account.lastName?.charAt(0) || ''}
												</span>
											</div>
										)}
										{/* Upload button overlay */}
										<motion.button
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
											onClick={() => setIsAvatarModalOpen(true)}
											className='absolute -bottom-1 -right-1 bg-main text-white p-2 rounded-full shadow-sm border-2 border-white opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-main/90'
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
										</motion.button>
									</div>

									{/* Basic Info */}
									<div className='flex-1 text-center md:text-left'>
										<h2 className='text-2xl font-bold text-gray-900 mb-4'>
											{account.firstName} {account.lastName}
										</h2>
										<div className='flex flex-col gap-3 text-gray-600 mb-6'>
											<div className='flex items-center justify-center md:justify-start gap-3'>
												<div className='w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-main'
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
												</div>
												<span className='font-medium'>{account.email}</span>
											</div>
											<div className='flex items-center justify-center md:justify-start gap-3'>
												<div className='w-8 h-8 bg-main/10 rounded-lg flex items-center justify-center'>
													<svg
														className='w-4 h-4 text-main'
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
												</div>
												<span className='font-medium'>
													{account.phoneNumber || 'Chưa cung cấp'}
												</span>
											</div>
										</div>
										<div className='flex flex-wrap justify-center md:justify-start gap-3'>
											<span
												className={`inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium ${
													account.isDeleted
														? 'bg-red-50 text-red-700 border border-red-200'
														: 'bg-green-50 text-green-700 border border-green-200'
												}`}
											>
												<div
													className={`w-2 h-2 rounded-full mr-2 ${
														account.isDeleted ? 'bg-red-500' : 'bg-green-500'
													}`}
												/>
												{account.isDeleted ? 'Đã xóa' : 'Hoạt động'}
											</span>
											<span className='inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-main/10 text-main border border-main/20'>
												{account.role?.name || 'Không có vai trò'}
											</span>
											<span className='inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-accent/10 text-accent border border-accent/20'>
												{account.gender ? 'Nam' : 'Nữ'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Account Information */}
						<motion.div
							className='bg-white rounded-xl border border-gray-200'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4, delay: 0.2 }}
						>
							<div className='p-6'>
								<h2 className='text-lg font-semibold text-gray-900 mb-6'>
									Thông tin tài khoản
								</h2>
								<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Họ
										</label>
										<p className='text-gray-900 font-medium'>
											{account.firstName || 'Chưa cung cấp'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Tên
										</label>
										<p className='text-gray-900 font-medium'>
											{account.lastName || 'Chưa cung cấp'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Email
										</label>
										<p className='text-gray-900 font-medium break-all'>
											{account.email}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Số điện thoại
										</label>
										<p className='text-gray-900 font-medium'>
											{account.phoneNumber || 'Chưa cung cấp'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Ngày sinh
										</label>
										<p className='text-gray-900 font-medium'>
											{account.dateOfBirth
												? format(new Date(account.dateOfBirth), 'dd/MM/yyyy')
												: 'Chưa cung cấp'}
										</p>
									</div>
									<div>
										<label className='block text-sm font-medium text-gray-500 mb-2'>
											Vai trò
										</label>
										<p className='text-gray-900 font-medium'>
											{account.role?.name || 'Chưa phân quyền'}
										</p>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Professional Information - Only show if staff data exists */}
						{(account.degree ||
							account.yearOfExperience ||
							account.biography ||
							(account as any).departmentName) && (
							<motion.div
								className='bg-white rounded-xl border border-gray-200'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.4, delay: 0.3 }}
							>
								<div className='p-6'>
									<h2 className='text-lg font-semibold text-gray-900 mb-6'>
										Thông tin chuyên môn
									</h2>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
										{(account as any).departmentName && (
											<div>
												<label className='block text-sm font-medium text-gray-500 mb-2'>
													Khoa
												</label>
												<p className='text-gray-900 font-medium'>
													{(account as any).departmentName}
												</p>
											</div>
										)}
										{account.degree && (
											<div>
												<label className='block text-sm font-medium text-gray-500 mb-2'>
													Bằng cấp
												</label>
												<p className='text-gray-900 font-medium'>
													{account.degree}
												</p>
											</div>
										)}
										{account.yearOfExperience && (
											<div>
												<label className='block text-sm font-medium text-gray-500 mb-2'>
													Năm kinh nghiệm
												</label>
												<p className='text-gray-900 font-medium'>
													{account.yearOfExperience} năm
												</p>
											</div>
										)}
										{account.biography && (
											<div className='md:col-span-2'>
												<label className='block text-sm font-medium text-gray-500 mb-2'>
													Tiểu sử
												</label>
												<p className='text-gray-900 leading-relaxed'>
													{account.biography}
												</p>
											</div>
										)}
									</div>
								</div>
							</motion.div>
						)}
					</div>
				)}
			</div>

			{/* Delete Confirmation Modal */}
			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDelete}
				title='Xóa tài khoản'
				message={`Bạn có chắc chắn muốn xóa tài khoản của ${account.firstName} ${account.lastName}? Hành động này không thể hoàn tác.`}
				confirmText='Xóa tài khoản'
				cancelText='Hủy'
				isDangerous={true}
				isLoading={deleteMutation.isPending}
			/>

			{/* Avatar Upload Modal */}
			{isAvatarModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<motion.div
						initial={{ opacity: 0, scale: 0.95 }}
						animate={{ opacity: 1, scale: 1 }}
						className='bg-white rounded-xl p-6 shadow-xl max-w-md w-full mx-4'
					>
						<div className='text-center mb-6'>
							<div className='w-12 h-12 bg-main rounded-lg flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-6 h-6 text-white'
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
								Cập nhật ảnh đại diện
							</h3>
							<p className='text-gray-600 text-sm'>
								Tải lên ảnh mới cho tài khoản này
							</p>
						</div>
						<div className='space-y-3'>
							<CloudinaryButton
								onUploaded={handleAvatarUpload}
								uploadPreset='gencare'
								text='Tải lên ảnh mới'
								className='w-full px-4 py-2.5 bg-main hover:bg-main/90 text-white rounded-lg font-medium transition-all duration-200'
							/>
							<motion.button
								whileHover={{ scale: 1.01 }}
								whileTap={{ scale: 0.99 }}
								onClick={() => setIsAvatarModalOpen(false)}
								className='w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 font-medium'
							>
								Hủy
							</motion.button>
						</div>
					</motion.div>
				</div>
			)}
		</motion.div>
	)
}

export default AccountDetailPage
