import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import React, { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import ProfileForm from './profileForm'
import { useUpdateAccount } from '@/Services/account-service'
import { useAccountStore } from '@/Hooks/useAccount'
import { CloudinaryButton } from '../CloudinaryButton'

const iconClass = 'inline-block w-5 h-5 mr-2 text-main opacity-80'

const Profile = ({ data }: { data: StaffAccount | undefined }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false)
	const [isAvatarLoading, setIsAvatarLoading] = useState(false)
	const updateAccount = useUpdateAccount()
	const { data: account, setAccount } = useAccountStore()

	const onSubmit = (formData: any) => {
		updateAccount.mutate(
			{ id: data?.id ?? '', data: { account: formData, staffInfo: formData } },
			{
				onSuccess: () => {
					setAccount({ ...account, ...formData })
					setIsModalOpen(false)
					console.log('Profile updated successfully')
				},
				onError: error => {
					console.error('Error updating profile:', error)
				},
			}
		)
	}

	const handleAvatarUpload = (url: string) => {
		if (!account) return
		setIsAvatarLoading(true)
		updateAccount.mutate(
			{ id: account.id, data: { account: { avatarUrl: url } } },
			{
				onSuccess: () => {
					setAccount({ ...account, avatarUrl: url })
					setIsAvatarModalOpen(false)
					setIsAvatarLoading(false)
				},
				onError: error => {
					console.error('Error updating avatar:', error)
					setIsAvatarLoading(false)
				},
			}
		)
	}

	if (!account) {
		return (
			<div className='text-center text-gray-500'>No account data found.</div>
		)
	}

	// Dynamic info fields config
	const infoFieldsRaw = [
		{
			label: 'Full Name',
			value: `${account.firstName} ${account.lastName}`,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M16.5 7.5v-1.125A2.625 2.625 0 0013.875 3.75h-3.75A2.625 2.625 0 007.5 6.375V7.5'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z'
					/>
				</svg>
			),
		},
		{
			label: 'Email',
			value: account.email,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M16.5 12a4.5 4.5 0 01-9 0m9 0a4.5 4.5 0 00-9 0m9 0V9.75A2.25 2.25 0 0016.5 7.5h-9A2.25 2.25 0 005.25 9.75V12m9 0v2.25A2.25 2.25 0 0112 16.5h0a2.25 2.25 0 01-2.25-2.25V12'
					/>
				</svg>
			),
		},
		{
			label: 'Phone',
			value: account.phoneNumber || 'N/A',
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M2.25 6.75v10.5A2.25 2.25 0 004.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M6.75 9.75h10.5'
					/>
				</svg>
			),
		},
		{
			label: 'Date of Birth',
			value: account.dateOfBirth,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 6v6l4 2'
					/>
				</svg>
			),
		},
		{
			label: 'Gender',
			value: account.gender ? 'Nam' : 'Nữ',
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 14.25c2.485 0 4.5-2.015 4.5-4.5S14.485 5.25 12 5.25 7.5 7.265 7.5 9.75s2.015 4.5 4.5 4.5z'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 17.25v.75'
					/>
				</svg>
			),
		},
		{
			label: 'Role',
			value: account.role.name,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M16.5 7.5v-1.125A2.625 2.625 0 0013.875 3.75h-3.75A2.625 2.625 0 007.5 6.375V7.5'
					/>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z'
					/>
				</svg>
			),
		},
		// Add more fields as needed, e.g. departmentName, degree, yearOfExperience, biography
		account.departmentName && {
			label: 'Department',
			value: account.departmentName,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 6v6l4 2'
					/>
				</svg>
			),
		},
		account.degree && {
			label: 'Degree',
			value: account.degree,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 6v6l4 2'
					/>
				</svg>
			),
		},
		account.yearOfExperience && {
			label: 'Years of Experience',
			value: account.yearOfExperience,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 6v6l4 2'
					/>
				</svg>
			),
		},
		account.biography && {
			label: 'Biography',
			value: account.biography,
			icon: (
				<svg
					className={iconClass}
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={1.5}
						d='M12 6v6l4 2'
					/>
				</svg>
			),
		},
	]
	const infoFields = infoFieldsRaw.filter(Boolean) as {
		label: string
		value: string | number
		icon: React.ReactNode
	}[]

	return (
		<div className='min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 py-6 px-2'>
			<div className='w-full max-w-2xl md:max-w-2xl sm:max-w-full mx-auto rounded-3xl shadow-2xl bg-white overflow-hidden relative animate-fade-in-up px-0 md:px-0'>
				{/* Accent Bar/Header */}
				<div className='bg-gradient-to-r from-accent to-blue-400 h-24 md:h-28 flex flex-col items-center justify-center relative'>
					<div className='absolute top-3 md:top-4 right-3 md:right-6 text-white text-xs bg-black/20 px-2 md:px-3 py-1 rounded-full font-semibold shadow-sm'>
						{account.role.name}
					</div>
					<div className='absolute left-3 md:left-6 top-3 md:top-4 text-white text-base md:text-lg font-bold drop-shadow-lg'>
						Profile
					</div>
				</div>
				{/* Avatar - overlaps accent bar */}
				<div className='flex flex-col items-center -mt-14 md:-mt-16 mb-2'>
					<div className='relative w-24 h-24 md:w-32 md:h-32 group cursor-pointer'>
						{account?.avatarUrl ? (
							<CldImage
								src={account?.avatarUrl}
								alt='avatar'
								className='rounded-full w-24 h-24 md:w-32 md:h-32 object-cover border-4 border-white shadow-lg'
								width={128}
								height={128}
							/>
						) : (
							<div className='w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-lg text-2xl md:text-3xl'>
								No Image
							</div>
						)}
						{/* Camera icon overlay for edit, only on hover */}
						<button
							onClick={() => setIsAvatarModalOpen(true)}
							type='button'
							className='absolute bottom-2 right-2 bg-accent p-2 rounded-full shadow-lg border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center'
							title='Edit Picture'
						>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								fill='none'
								viewBox='0 0 24 24'
								strokeWidth={1.5}
								stroke='currentColor'
								className='w-5 h-5 text-white'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.75 10.5V6.75A2.25 2.25 0 0013.5 4.5h-3A2.25 2.25 0 008.25 6.75v3.75m7.5 0v6.75A2.25 2.25 0 0113.5 19.5h-3a2.25 2.25 0 01-2.25-2.25V10.5m7.5 0h-7.5'
								/>
							</svg>
						</button>
						{/* Loading spinner overlay when updating avatar */}
						{isAvatarLoading && (
							<div className='absolute inset-0 flex items-center justify-center bg-white/60 rounded-full'>
								<svg
									className='animate-spin h-8 w-8 text-accent'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8v8z'
									></path>
								</svg>
							</div>
						)}
					</div>
					<div className='mt-2 text-center'>
						<div className='text-lg md:text-2xl font-bold text-main mb-1 break-words max-w-xs md:max-w-full'>
							{account?.firstName} {account?.lastName}
						</div>
						<div className='text-gray-500 text-xs md:text-sm break-words max-w-xs md:max-w-full'>
							{account?.email}
						</div>
					</div>
				</div>
				{/* Info Section */}
				<div className='px-2 md:px-8 py-4'>
					<ul className='space-y-2 md:space-y-3'>
						{infoFields.map(field => (
							<li
								key={field.label}
								className='flex flex-col md:flex-row md:items-center text-gray-700 text-sm md:text-base break-words max-w-full'
							>
								<span className='flex-shrink-0'>{field.icon}</span>
								<span className='flex-1 min-w-0'>
									<span className='font-semibold'>{field.label}:</span>{' '}
									<span className='truncate block md:inline'>
										{field.value}
									</span>
								</span>
							</li>
						))}
					</ul>
					<div className='my-6 border-t border-gray-200'></div>
					<div className='flex justify-center'>
						<button
							onClick={() => setIsModalOpen(true)}
							className='bg-accent text-white px-6 py-2 rounded-full font-semibold shadow-md hover:bg-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50'
						>
							Edit Profile
						</button>
					</div>
				</div>
				{/* Edit Modal */}
				{isModalOpen && (
					<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in'>
						<div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg scale-95 animate-fade-in-up'>
							<h2 className='text-xl font-bold mb-4 text-main'>Edit Profile</h2>
							<ProfileForm
								initialData={account}
								onSubmit={onSubmit}
								onCancel={() => setIsModalOpen(false)}
							/>
						</div>
					</div>
				)}
				{/* Avatar Edit Modal */}
				{isAvatarModalOpen && (
					<div className='fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in'>
						<div className='bg-white p-8 rounded-2xl shadow-2xl w-full max-w-xs scale-95 animate-fade-in-up flex flex-col items-center'>
							<h2 className='text-lg font-bold mb-4 text-main'>
								Edit Profile Picture
							</h2>
							<CloudinaryButton
								onUploaded={handleAvatarUpload}
								uploadPreset='gencare'
								text='Upload New Picture'
								className='bg-accent text-white px-4 py-2 rounded-full hover:bg-blue-600 transition-colors mb-4'
							/>
							<button
								onClick={() => setIsAvatarModalOpen(false)}
								className='mt-2 px-4 py-2 bg-gray-400 text-white rounded-full hover:bg-gray-500'
							>
								Cancel
							</button>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}

export default Profile
