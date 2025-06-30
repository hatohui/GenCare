'use client'

import SearchBar from '@/Components/Management/SearchBar'
import { motion } from 'motion/react'
import React from 'react'

const TestsPage = () => {
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

			{/* Content Placeholder */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className='bg-white border border-gray-200 rounded-[20px] p-8 shadow-sm text-center'
			>
				<div className='text-gray-500'>
					<h3 className='text-lg font-semibold mb-2'>
						Tính năng đang phát triển
					</h3>
					<p>Trang quản lý kết quả xét nghiệm sẽ được cập nhật sớm.</p>
				</div>
			</motion.div>
		</div>
	)
}

export default TestsPage
