import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import React, { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import ProfileForm from './profileForm'
import { useUpdateAccount } from '@/Services/account-service'
import { useAccountStore } from '@/Hooks/useAccount'
import { CloudinaryButton } from '../CloudinaryButton'
import { toast } from 'react-hot-toast'
import {
	User,
	Mail,
	Phone,
	Calendar,
	Venus,
	Briefcase,
	GraduationCap,
	Award,
	Info,
	Camera,
} from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'

const iconClass = 'inline-block w-5 h-5 mr-2 text-main opacity-80'

const Profile = ({ data }: { data: StaffAccount | undefined }) => {
	const { t } = useLocale()
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
					toast.success('Profile updated successfully')
				},
				onError: error => {
					console.error('Error updating profile:', error)
					toast.error('Failed to update profile')
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
					toast.success('Avatar updated successfully')
				},
				onError: error => {
					console.error('Error updating avatar:', error)
					setIsAvatarLoading(false)
					toast.error('Failed to update avatar')
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
			label: t('management.account.full_name'),
			value: `${account.firstName} ${account.lastName}`,
			icon: <User className={iconClass} />,
		},
		{
			label: t('management.account.email'),
			value: account.email,
			icon: <Mail className={iconClass} />,
		},
		{
			label: t('management.account.phone_number'),
			value: account.phoneNumber || 'N/A',
			icon: <Phone className={iconClass} />,
		},
		{
			label: t('management.account.date_of_birth'),
			value: account.dateOfBirth,
			icon: <Calendar className={iconClass} />,
		},
		{
			label: t('management.account.gender'),
			value: account.gender
				? t('management.account.gender_male')
				: t('management.account.gender_female'),
			icon: <Venus className={iconClass} />,
		},
		{
			label: t('management.account.role'),
			value: account.role.name,
			icon: <Briefcase className={iconClass} />,
		},
		account.staffInfo?.departmentName && {
			label: t('management.account.department'),
			value: account.staffInfo.departmentName,
			icon: <Briefcase className={iconClass} />,
		},
		account.staffInfo?.degree && {
			label: t('management.account.degree'),
			value: account.staffInfo.degree,
			icon: <GraduationCap className={iconClass} />,
		},
		account.staffInfo?.yearOfExperience && {
			label: t('management.account.years_experience'),
			value: account.staffInfo.yearOfExperience,
			icon: <Award className={iconClass} />,
		},
		account.staffInfo?.biography && {
			label: t('management.account.biography'),
			value: account.staffInfo.biography,
			icon: <Info className={iconClass} />,
		},
	]
	const infoFields = infoFieldsRaw.filter(Boolean) as {
		label: string
		value: string | number
		icon: React.ReactNode
	}[]

	return (
		<div className='min-h-screen bg-gradient-to-br py-8 px-2 flex flex-col items-center'>
			<div className='w-full max-w-3xl mx-auto rounded-3xl shadow-2xl bg-white overflow-hidden relative animate-fade-in-up px-0'>
				{/* Header Section */}
				<div className='flex flex-col md:flex-row items-center md:items-end justify-between bg-gradient-to-r from-main to-secondary px-8 py-8 md:py-10 relative'>
					<div className='flex flex-col items-center md:items-start gap-2'>
						<div className='text-white text-2xl md:text-3xl font-bold drop-shadow-lg'>
							{t('profile.title')}
						</div>
						<div className='text-white text-sm md:text-base bg-black/20 px-3 py-1 rounded-full font-semibold shadow-sm'>
							{account.role.name}
						</div>
					</div>
					<div className='relative group flex-shrink-0 mt-6 md:mt-0'>
						<div className='flex flex-col items-center'>
							{account?.avatarUrl ? (
								<CldImage
									src={account?.avatarUrl}
									alt='avatar'
									className='rounded-full w-32 h-32 md:w-40 md:h-40 object-cover border-4 border-white shadow-lg'
									width={160}
									height={160}
								/>
							) : (
								<div className='w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-white shadow-lg text-2xl md:text-3xl'>
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
								<Camera className='w-5 h-5 text-white' />
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
					</div>
				</div>
				{/* Info Section */}
				<div className='px-8 md:px-16 py-10'>
					<ul className='grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6'>
						{infoFields.map(field => (
							<li
								key={field.label}
								className='flex items-center text-gray-700 text-base break-words max-w-full bg-gray-50 rounded-xl px-5 py-4 shadow-sm border border-gray-100'
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
					<div className='my-10 border-t border-gray-200'></div>
					<div className='flex justify-center'>
						<button
							onClick={() => setIsModalOpen(true)}
							className='bg-accent text-white px-10 py-3 rounded-full font-semibold shadow-md hover:bg-blue-600 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-accent/50 text-lg'
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
