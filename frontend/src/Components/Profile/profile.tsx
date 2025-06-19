import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import React, { useEffect, useState } from 'react'
import { CldImage } from 'next-cloudinary'
import { PencilSquareSVG } from '../SVGs'
import { CloudinaryButton } from '../CloudinaryButton'
import { useUpdateAccount } from '@/Services/account-service'

const Profile = ({ data }: { data?: StaffAccount }) => {
	const updateAccount = useUpdateAccount(data?.id ?? '')
	const [avatarUrl, setAvatarUrl] = useState(data?.avatarUrl)

	const handleUpload = (url: string) => {
		setAvatarUrl(url)
		updateAccount.mutate({
			account: { ...data, avatarUrl: url },
		})
	}

	return (
		<div className='max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg grid grid-cols-4 gap-6 shadow-secondary/10'>
			<h1 className='text-2xl font-bold col-span-4 text-center text-main'>
				Account Profile
			</h1>
			<div className='col-span-1'>
				<div className='relative rounded-full w-24 h-24 bg-gray-200 mx-auto flex items-center justify-center border-8 border-gray-300 group'>
					{avatarUrl ? (
						<CldImage
							src={avatarUrl}
							alt='avatar'
							className='rounded-full w-24 h-24 object-cover mx-auto'
							width={96}
							height={96}
						/>
					) : (
						<span className='text-gray-500'>No Image</span>
					)}
					<div className='absolute inset-0 flex items-center justify-center bg-black/50 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity overflow-hidden rounded-full	'>
						<CloudinaryButton
							onUploaded={handleUpload}
							uploadPreset='gencare'
							text=''
							className='w-full h-full absolute'
						/>
						<PencilSquareSVG className='text-white size-10 pointer-events-none' />
					</div>
				</div>
			</div>
			<div className='col-span-3 flex flex-col gap-2 py-5'>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Full Name
					</label>
					<p>
						{data?.firstName} {data?.lastName}
					</p>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Email
					</label>
					<p className='text-gray-500'>{data?.email}</p>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Phone
					</label>
					<p className='text-gray-500'>
						{data?.phoneNumber ? data.phoneNumber : 'N/A'}
					</p>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Role
					</label>
					<p className='text-gray-500'>{data?.role.name}</p>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Date of Birth
					</label>
					<p className='text-gray-500'>{data?.dateOfBirth}</p>
				</div>
				<div>
					<label className='block text-sm font-medium text-gray-700'>
						Gender
					</label>
					<p className='text-gray-500'>{String(data?.gender)}</p>
				</div>
			</div>
		</div>
	)
}

export default Profile
