'use client'

import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { motion } from 'motion/react'
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

	const handleDelete = () => {
		if (!id) return

		deleteMutation.mutate(id, {
			onSuccess: () => {
				setIsDeleteModalOpen(false)
				router.push('/dashboard/accounts')
			},
			onError: error => {
				console.error('Failed to delete account:', error)
				// You could show a toast notification here
			},
		})
	}

	const handlePaymentHistory = () => {
		router.push(`/dashboard/payment-history?userId=${id}`)
	}

	return (
		<motion.div
			className='min-h-screen bg-general'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			{/* Header */}
			<div className='bg-gradient-to-r from-main to-secondary text-white shadow-lg'>
				<div className='max-w-7xl mx-auto px-6 py-8'>
					<div className='flex items-center justify-between'>
						<div className='flex items-center gap-6'>
							<button
								onClick={() => router.push('/dashboard/accounts')}
								className='p-3 hover:bg-white/10 rounded-[12px] transition-colors'
							>
								<ArrowLeftIcon className='w-6 h-6 text-white' />
							</button>
							<div className='flex-1'>
								<h1 className='text-3xl font-bold text-white'>
									Chi tiết tài khoản
								</h1>
								<p className='text-white/80 mt-2 text-lg'>
									{account.firstName} {account.lastName} - {account.email}
								</p>
							</div>
						</div>
						<div className='flex items-center gap-3'>
							{!isEditing ? (
								<>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={handlePaymentHistory}
										className='px-6 py-3 bg-white/10 text-white rounded-[12px] hover:bg-white/20 transition-all duration-300 shadow-lg backdrop-blur-sm font-semibold'
									>
										Lịch sử thanh toán
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsEditing(true)}
										className='px-6 py-3 bg-accent text-white rounded-[12px] hover:bg-accent/90 transition-all duration-300 shadow-lg font-semibold'
									>
										Chỉnh sửa
									</motion.button>
									<motion.button
										whileHover={{ scale: 1.02 }}
										whileTap={{ scale: 0.98 }}
										onClick={() => setIsDeleteModalOpen(true)}
										className='px-6 py-3 bg-red-500 text-white rounded-[12px] hover:bg-red-600 transition-all duration-300 shadow-lg font-semibold'
									>
										Xóa
									</motion.button>
								</>
							) : (
								<motion.button
									whileHover={{ scale: 1.02 }}
									whileTap={{ scale: 0.98 }}
									onClick={() => setIsEditing(false)}
									className='px-6 py-3 bg-gray-500 text-white rounded-[12px] hover:bg-gray-600 transition-all duration-300 shadow-lg font-semibold'
								>
									Hủy
								</motion.button>
							)}
						</div>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className='max-w-7xl mx-auto px-6 py-8'>
				{isEditing ? (
					<motion.div
						className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<div className='px-8 py-6 bg-gradient-to-r from-main/10 to-secondary/10 border-b border-gray-100'>
							<h2 className='text-xl font-bold text-gray-800 flex items-center gap-3'>
								<div className='w-10 h-10 bg-gradient-to-br from-main to-secondary rounded-[12px] flex items-center justify-center'>
									<svg
										className='w-5 h-5 text-white'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z'
										/>
									</svg>
								</div>
								Chỉnh sửa thông tin tài khoản
							</h2>
						</div>
						<div className='p-8'>
							<AccountForm
								initialData={account}
								onSave={handleSave}
								onCancel={() => setIsEditing(false)}
								isLoading={updateMutation.isPending}
							/>
						</div>
					</motion.div>
				) : (
					<div className='space-y-8'>
						{/* Avatar Section */}
						<motion.div
							className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.6, delay: 0.1 }}
						>
							<div className='px-8 py-6 bg-gradient-to-r from-main/10 to-secondary/10 border-b border-gray-100'>
								<h2 className='text-xl font-bold text-gray-800 flex items-center gap-3'>
									<div className='w-10 h-10 bg-gradient-to-br from-main to-secondary rounded-[12px] flex items-center justify-center'>
										<svg
											className='w-5 h-5 text-white'
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
									</div>
									Ảnh đại diện
								</h2>
							</div>
							<div className='p-8'>
								<div className='flex flex-col md:flex-row items-center gap-8'>
									{/* Avatar */}
									<div className='relative group'>
										{account.avatarUrl ? (
											<CldImage
												src={account.avatarUrl}
												alt={`${account.firstName} ${account.lastName}`}
												width={120}
												height={120}
												className='rounded-full border-4 border-gray-100 group-hover:border-main group-hover:border-opacity-30 transition-all duration-300 object-cover shadow-lg'
											/>
										) : (
											<div className='w-[120px] h-[120px] rounded-full bg-gradient-to-br from-main to-secondary flex items-center justify-center border-4 border-gray-100 group-hover:border-main group-hover:border-opacity-30 transition-all duration-300 shadow-lg'>
												<span className='text-white text-3xl font-bold'>
													{account.firstName?.charAt(0) || '?'}
													{account.lastName?.charAt(0) || ''}
												</span>
											</div>
										)}
										{/* Upload button overlay */}
										<motion.button
											whileHover={{ scale: 1.1 }}
											whileTap={{ scale: 0.9 }}
											onClick={() => setIsAvatarModalOpen(true)}
											className='absolute -bottom-2 -right-2 bg-accent text-white p-3 rounded-full shadow-lg border-3 border-white opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-accent/90'
										>
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
										<h2 className='text-3xl font-bold text-gray-900 mb-4'>
											{account.firstName} {account.lastName}
										</h2>
										<div className='flex flex-col gap-3 text-gray-600 mb-6'>
											<div className='flex items-center justify-center md:justify-start gap-3'>
												<div className='w-8 h-8 bg-gradient-to-br from-main/20 to-secondary/20 rounded-[8px] flex items-center justify-center'>
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
												<div className='w-8 h-8 bg-gradient-to-br from-main/20 to-secondary/20 rounded-[8px] flex items-center justify-center'>
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
												className={`inline-flex items-center px-4 py-2 rounded-[12px] text-sm font-bold shadow-md ${
													account.isDeleted
														? 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border-2 border-red-300'
														: 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border-2 border-green-300'
												}`}
											>
												<div
													className={`w-3 h-3 rounded-full mr-2 ${
														account.isDeleted ? 'bg-red-500' : 'bg-green-500'
													}`}
												/>
												{account.isDeleted ? 'Đã xóa' : 'Hoạt động'}
											</span>
											<span className='inline-flex items-center px-4 py-2 rounded-[12px] text-sm font-bold shadow-md bg-gradient-to-r from-main/10 to-secondary/10 text-main border-2 border-main/20'>
												{account.role?.name || 'Không có vai trò'}
											</span>
											<span className='inline-flex items-center px-4 py-2 rounded-[12px] text-sm font-bold shadow-md bg-gradient-to-r from-accent/10 to-accent/20 text-accent border-2 border-accent/20'>
												{account.gender ? 'Nam' : 'Nữ'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</motion.div>

						{/* Details Grid */}
						<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
							{/* Personal Information */}
							<motion.div
								className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.2 }}
							>
								<div className='px-8 py-6 bg-gradient-to-r from-secondary/10 to-main/10 border-b border-gray-100'>
									<h3 className='text-lg font-bold text-gray-800 flex items-center gap-3'>
										<div className='w-8 h-8 bg-gradient-to-br from-secondary to-main rounded-[8px] flex items-center justify-center'>
											<svg
												className='w-4 h-4 text-white'
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
										</div>
										Thông tin cá nhân
									</h3>
								</div>
								<div className='p-8 space-y-6'>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Họ
										</label>
										<p className='text-gray-900 font-medium text-lg'>
											{account.firstName || 'Chưa cung cấp'}
										</p>
									</div>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Tên
										</label>
										<p className='text-gray-900 font-medium text-lg'>
											{account.lastName || 'Chưa cung cấp'}
										</p>
									</div>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Ngày sinh
										</label>
										<p className='text-gray-900 font-medium text-lg'>
											{account.dateOfBirth
												? format(new Date(account.dateOfBirth), 'dd/MM/yyyy')
												: 'Chưa cung cấp'}
										</p>
									</div>
								</div>
							</motion.div>

							{/* Contact Information */}
							<motion.div
								className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden'
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ duration: 0.6, delay: 0.3 }}
							>
								<div className='px-8 py-6 bg-gradient-to-r from-main/10 to-secondary/10 border-b border-gray-100'>
									<h3 className='text-lg font-bold text-gray-800 flex items-center gap-3'>
										<div className='w-8 h-8 bg-gradient-to-br from-main to-secondary rounded-[8px] flex items-center justify-center'>
											<svg
												className='w-4 h-4 text-white'
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
										</div>
										Thông tin liên hệ
									</h3>
								</div>
								<div className='p-8 space-y-6'>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Địa chỉ email
										</label>
										<p className='text-gray-900 font-medium text-lg break-all'>
											{account.email}
										</p>
									</div>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Số điện thoại
										</label>
										<p className='text-gray-900 font-medium text-lg'>
											{account.phoneNumber || 'Chưa cung cấp'}
										</p>
									</div>
									<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
										<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
											Vai trò
										</label>
										<p className='text-gray-900 font-medium text-lg'>
											{account.role?.name || 'Chưa phân quyền'}
										</p>
									</div>
								</div>
							</motion.div>

							{/* Professional Information - Only show if staff data exists */}
							{(account.degree ||
								account.yearOfExperience ||
								account.biography) && (
								<motion.div
									className='bg-white rounded-[20px] shadow-xl border border-gray-100 overflow-hidden lg:col-span-2'
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.6, delay: 0.4 }}
								>
									<div className='px-8 py-6 bg-gradient-to-r from-accent/10 to-accent/20 border-b border-gray-100'>
										<h3 className='text-lg font-bold text-gray-800 flex items-center gap-3'>
											<div className='w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-[8px] flex items-center justify-center'>
												<svg
													className='w-4 h-4 text-white'
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
											</div>
											Thông tin chuyên môn
										</h3>
									</div>
									<div className='p-8'>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
											{account.degree && (
												<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
													<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
														Bằng cấp
													</label>
													<p className='text-gray-900 font-medium text-lg'>
														{account.degree}
													</p>
												</div>
											)}
											{account.yearOfExperience && (
												<div className='bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
													<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
														Năm kinh nghiệm
													</label>
													<p className='text-gray-900 font-medium text-lg'>
														{account.yearOfExperience} năm
													</p>
												</div>
											)}
											{account.biography && (
												<div className='md:col-span-2 bg-gray-50 rounded-[12px] p-4 border border-gray-200'>
													<label className='block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2'>
														Tiểu sử
													</label>
													<p className='text-gray-900 leading-relaxed text-lg'>
														{account.biography}
													</p>
												</div>
											)}
										</div>
									</div>
								</motion.div>
							)}
						</div>
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
				<div className='fixed inset-0 bg-black/30 backdrop-blur-[6px] flex items-center justify-center z-50'>
					<motion.div
						initial={{ opacity: 0, scale: 0.9 }}
						animate={{ opacity: 1, scale: 1 }}
						className='bg-white rounded-[20px] p-8 shadow-2xl max-w-md w-full mx-4'
					>
						<div className='text-center mb-6'>
							<div className='w-16 h-16 bg-gradient-to-br from-main to-secondary rounded-[16px] flex items-center justify-center mx-auto mb-4'>
								<svg
									className='w-8 h-8 text-white'
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
							<h3 className='text-xl font-bold text-gray-900 mb-2'>
								Cập nhật ảnh đại diện
							</h3>
							<p className='text-gray-600'>Tải lên ảnh mới cho tài khoản này</p>
						</div>
						<div className='space-y-4'>
							<CloudinaryButton
								onUploaded={handleAvatarUpload}
								uploadPreset='gencare'
								text='Tải lên ảnh mới'
								className='w-full px-6 py-4 bg-gradient-to-r from-main to-secondary hover:from-secondary hover:to-main text-white rounded-[12px] font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
							/>
							<motion.button
								whileHover={{ scale: 1.02 }}
								whileTap={{ scale: 0.98 }}
								onClick={() => setIsAvatarModalOpen(false)}
								className='w-full px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-[12px] hover:bg-gray-50 transition-all duration-300 font-semibold'
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
