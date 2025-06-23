import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import React, { useState } from 'react'
import { CldImage } from 'next-cloudinary'
import ProfileForm from './profileForm'
import { useUpdateAccount } from '@/Services/account-service'
import { useAccountStore } from '@/Hooks/useAccount'

const Profile = ({ data }: { data: StaffAccount | undefined }) => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const updateAccount = useUpdateAccount(data?.id || '')
	const { data: account, setAccount } = useAccountStore()

	const onSubmit = (formData: any) => {
		// Handle form submission logic here
		console.log('Form submitted:', formData)
		updateAccount.mutate(
			{ account: formData, staffInfo: formData },
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

	if (!account) {
		return (
			<div className='text-center text-gray-500'>No account data found.</div>
		)
	}

	return (
		<div className='p-6 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-6 shadow-secondary/10'>
			<h1 className='text-2xl font-bold col-span-4 text-center text-main'>
				Account Profile
			</h1>

			<div className='col-span-1'>
				<div className='relative group w-24 h-24 mx-auto'>
					{account?.avatarUrl ? (
						<CldImage
							src={account?.avatarUrl}
							alt='avatar'
							className='rounded-full w-full h-full object-cover border-4 border-gray-300'
							width={96}
							height={96}
						/>
					) : (
						<div className='w-full h-full rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-4 border-gray-300'>
							No Image
						</div>
					)}
				</div>
			</div>

			<div className='col-span-3 flex flex-col gap-2 py-5'>
				<ul className='space-y-2'>
					<li className='flex items-center'>
						<strong className='w-24'>Full Name:</strong>
						<span className='ml-2'>
							{account?.firstName} {account?.lastName}
						</span>
					</li>
					<li className='flex items-center'>
						<strong className='w-24'>Email:</strong>
						<span className='ml-2'>{account?.email}</span>
					</li>
					<li className='flex items-center'>
						<strong className='w-24'>Phone:</strong>
						<span className='ml-2'>{account?.phoneNumber || 'N/A'}</span>
					</li>
					<li className='flex items-center'>
						<strong className='w-24'>Role:</strong>
						<span className='ml-2'>{account?.role.name}</span>
					</li>
					<li className='flex items-center'>
						<strong className='w-24'>Date of Birth:</strong>
						<span className='ml-2'>{account?.dateOfBirth}</span>
					</li>
					<li className='flex items-center'>
						<strong className='w-24'>Gender:</strong>
						<span className='ml-2'>{account?.gender ? 'Nam' : 'Nữ'}</span>
					</li>
				</ul>
				<button
					onClick={() => setIsModalOpen(true)}
					className='mt-4 bg-accent text-white px-4 py-2 rounded hover:bg-blue-600 w-fit'
				>
					Edit
				</button>
			</div>
			{isModalOpen && (
				<div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
					<div className='bg-white p-6 rounded-lg shadow-xl w-full max-w-lg'>
						<h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
						<ProfileForm
							initialData={account}
							onSubmit={onSubmit}
							onCancel={() => setIsModalOpen(false)}
						/>
					</div>
				</div>
			)}
		</div>
	)
}

export default Profile
