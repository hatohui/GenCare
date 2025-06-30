'use client'

import SearchBar from '@/Components/Management/SearchBar'
import AccountListTest from '@/Components/staff/AccountListTest'
import { motion } from 'motion/react'
import React from 'react'

const Page = () => {
	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					Quản Lý Kết Quả Xét Nghiệm
				</h1>
				<p className='text-gray-600'>
					Xem và quản lý kết quả xét nghiệm của khách hàng
				</p>
			</motion.div>

			{/* Search Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<SearchBar className='flex-1' waitTime={1000} />
					</div>
				</div>
			</motion.div>

			{/* Account List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<AccountListTest />
			</motion.div>
		</div>
	)
}

export default Page
