import { Account } from '@/Interfaces/Auth/Types/Account'
import { CldImage } from 'next-cloudinary'
import { useRouter } from 'next/navigation'
import React from 'react'

const AccountItem = ({ item }: { item: Account }) => {
	const router = useRouter()

	return (
		<div>
			<div
				key={item.id}
				className='flex flex-col gap-2 rounded-[30px] bg-white p-4 hover:shadow-2xl hover:scale-105 transition duration-300 h-[200px]'
				onClick={() => router.push(`/dashboard/payments/${item.id}`)}
			>
				{item.avatarUrl && (
					<CldImage
						src={item.avatarUrl}
						width={100}
						height={100}
						alt={item.firstName}
						className='rounded-full'
					/>
				)}
				<div className='flex flex-col gap-2'>
					<h3 className='text-lg font-semibold text-gray-900'>
						{item.firstName} {item.lastName}
					</h3>
					<p className='text-sm text-gray-500'>{item.email}</p>
				</div>
			</div>
		</div>
	)
}

export default AccountItem
