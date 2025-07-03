'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import Calendar from '@/Components/app/BirthControl/Calender'
import { useAccountStore } from '@/Hooks/useAccount'
import { useBirthControl } from '@/Hooks/useBirthControl'
import { useGetBirthControl } from '@/Services/birthControl-service'
import React, { useEffect, useState } from 'react'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { getMonth, getYear, format } from 'date-fns'
import { vi } from 'date-fns/locale'

const Page = () => {
	const { data: account } = useAccountStore()
	const {
		data: getBirthControl,
		isLoading,
		error,
	} = useGetBirthControl(account?.id || '')
	const { birthControl, setBirthControl } = useBirthControl()

	useEffect(() => {
		if (getBirthControl) setBirthControl(getBirthControl)
	}, [getBirthControl, setBirthControl])

	const now = new Date()
	const [month, setMonth] = useState(getMonth(now))
	const [year, setYear] = useState(getYear(now))

	const handlePreviousMonth = () => {
		if (month === 0) {
			setMonth(11)
			setYear(year - 1)
		} else {
			setMonth(month - 1)
		}
	}

	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0)
			setYear(year + 1)
		} else {
			setMonth(month + 1)
		}
	}

	if (isLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>Đang tải thông tin chu kỳ...</p>
				</div>
			</div>
		)
	}

	if (error) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						Không thể tải thông tin
					</h3>
					<p className='text-gray-600 mb-4'>
						Đã xảy ra lỗi khi tải thông tin chu kỳ. Vui lòng thử lại sau.
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						Thử lại
					</button>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto p-6 space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					Theo Dõi Chu Kỳ Kinh Nguyệt
				</h1>
				<p className='text-gray-600'>
					Quản lý và theo dõi chu kỳ kinh nguyệt của bạn một cách an toàn và
					chính xác
				</p>
			</motion.div>

			{/* Main Content */}
			<div className='grid lg:grid-cols-3 gap-6'>
				{/* Form Section */}
				<motion.div
					initial={{ opacity: 0, x: -20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.1 }}
					className='lg:col-span-1'
				>
					<BirthControlForm accountID={account?.id || ''} />
				</motion.div>

				{/* Calendar Section */}
				<motion.div
					initial={{ opacity: 0, x: 20 }}
					animate={{ opacity: 1, x: 0 }}
					transition={{ delay: 0.2 }}
					className='lg:col-span-2'
				>
					<div className='bg-white p-6 rounded-[30px] shadow-sm border border-gray-200'>
						{/* Calendar Header */}
						<div className='flex items-center justify-between mb-6'>
							<h2 className='text-2xl font-bold text-main'>Lịch Chu Kỳ</h2>
							<div className='flex items-center gap-3'>
								<button
									onClick={handlePreviousMonth}
									className='bg-main hover:bg-main/90 text-white px-4 py-2 rounded-[20px] transition-colors text-sm font-medium'
								>
									← Tháng trước
								</button>
								<div className='text-lg font-semibold text-gray-800 min-w-[120px] text-center'>
									{format(new Date(year, month), 'MMMM', {
										locale: vi,
									})}{' '}
									{year}
								</div>
								<button
									onClick={handleNextMonth}
									className='bg-main hover:bg-main/90 text-white px-4 py-2 rounded-[20px] transition-colors text-sm font-medium'
								>
									Tháng sau →
								</button>
							</div>
						</div>

						{/* Calendar */}
						<Calendar year={year} month={month} cycle={birthControl} />
					</div>
				</motion.div>
			</div>

			{/* Information Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-[30px] border border-blue-200'
			>
				<h2 className='text-xl font-bold text-main mb-4'>
					Thông Tin Về Phương Pháp Theo Dõi Chu Kỳ
				</h2>
				<div className='grid md:grid-cols-2 gap-6 text-sm text-gray-700'>
					<div className='space-y-3'>
						<h3 className='font-semibold text-gray-800'>Cách Hoạt Động:</h3>
						<ul className='space-y-2 list-disc list-inside'>
							<li>Theo dõi ngày bắt đầu chu kỳ kinh nguyệt</li>
							<li>Tính toán các pha an toàn và không an toàn</li>
							<li>Dự đoán ngày rụng trứng</li>
							<li>Cung cấp thông tin để lập kế hoạch</li>
						</ul>
					</div>
					<div className='space-y-3'>
						<h3 className='font-semibold text-gray-800'>Lưu Ý Quan Trọng:</h3>
						<ul className='space-y-2 list-disc list-inside'>
							<li>Phương pháp này chỉ mang tính tham khảo</li>
							<li>Không đảm bảo 100% hiệu quả tránh thai</li>
							<li>Nên kết hợp với các biện pháp khác</li>
							<li>Tham khảo ý kiến bác sĩ khi cần thiết</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default Page
