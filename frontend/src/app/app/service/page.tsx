'use client'

import { BookingButton } from '@/Components/Services/ServiceCart'
import { useEffect } from 'react'
import SearchBar from '@/Components/Management/SearchBar'
import { useSearchParams } from 'next/navigation'
import clsx from 'clsx'
import { SearchSVG } from '@/Components/SVGs'
import ServiceList from '@/Components/app/services/ServiceList'
import { useRouter, usePathname } from 'next/navigation'
import { motion } from 'motion/react'
import { toast } from 'react-hot-toast'

export default function Page() {
	const searchParams = useSearchParams()
	const router = useRouter()
	const pathname = usePathname()

	useEffect(() => {
		const sort = searchParams.get('orderByPrice') || ''
		const search = searchParams.get('search') || ''

		console.log(sort, search)
	}, [searchParams]) // triggers when the URL params change

	const handleSortToggle = () => {
		try {
			const params = new URLSearchParams(searchParams)
			if (!params.has('orderByPrice')) {
				params.set('orderByPrice', 'true')
			} else if (params.get('orderByPrice') === 'true') {
				params.set('orderByPrice', 'false')
			} else {
				params.delete('orderByPrice')
			}

			router.push(`${pathname}?${params.toString()}`)
		} catch (error) {
			console.error('Error updating sort:', error)
			toast.error('Có lỗi xảy ra khi sắp xếp. Vui lòng thử lại.')
		}
	}

	const getSortButtonText = () => {
		const orderByPrice = searchParams.get('orderByPrice')
		if (orderByPrice === 'true') return 'Giá tăng dần ↑'
		if (orderByPrice === 'false') return 'Giá giảm dần ↓'
		return 'Sắp xếp giá'
	}

	return (
		<div className='min-h-screen bg-gray-50'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='bg-white border-b border-gray-200'
			>
				<div className='max-w-7xl mx-auto px-6 py-6'>
					{/* Breadcrumb */}
					<nav className='mb-4'>
						<ol className='flex items-center space-x-2 text-sm text-gray-600'>
							<li>
								<button
									onClick={() => router.back()}
									className='hover:text-main transition-colors'
								>
									← Quay lại
								</button>
							</li>
							<li>/</li>
							<li className='text-main font-medium'>Dịch vụ</li>
						</ol>
					</nav>

					{/* Page Title */}
					<div className='text-center mb-6'>
						<h1 className='text-3xl font-bold text-main mb-2'>Dịch Vụ Y Tế</h1>
						<p className='text-gray-600'>
							Khám phá các dịch vụ chăm sóc sức khỏe chất lượng cao
						</p>
					</div>
				</div>
			</motion.div>

			{/* Search and Filter Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='bg-white border-b border-gray-200 sticky top-0 z-10 translate-y-[-30px]'
			>
				<div className='max-w-7xl mx-auto px-6 py-4'>
					<div className='flex flex-col lg:flex-row gap-4 items-center'>
						{/* Search Bar */}
						<div className='relative flex-1 w-full max-w-2xl'>
							<SearchSVG className='absolute top-1/2 left-4 -translate-y-1/2 text-gray-400 z-10 size-5' />
							<SearchBar className=' border-gray-300  ml-12  pr-12 py-3 rounded-[30px] text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-main/20 focus:border-main transition-all' />
						</div>

						{/* Sort Button */}
						<div className='flex items-center gap-3'>
							<button
								onClick={handleSortToggle}
								className={clsx(
									'px-6 py-3 text-sm font-medium rounded-[30px] border transition-all duration-200 flex items-center gap-2',
									{
										'bg-main text-white border-main shadow-md hover:shadow-lg':
											searchParams.get('orderByPrice') !== null,
										'bg-white text-gray-700 border-gray-300 hover:border-main hover:bg-gray-50':
											searchParams.get('orderByPrice') === null,
									}
								)}
							>
								<span>{getSortButtonText()}</span>
								{searchParams.get('orderByPrice') && (
									<span className='text-xs'>
										{searchParams.get('orderByPrice') === 'true' ? '↑' : '↓'}
									</span>
								)}
							</button>

							{/* Booking Button */}
							<BookingButton />
						</div>
					</div>
				</div>
			</motion.div>

			{/* Services Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className='max-w-7xl mx-auto px-6 py-8'
			>
				{/* Active Filters Display */}
				{(searchParams.get('search') || searchParams.get('orderByPrice')) && (
					<div className='mb-6'>
						<div className='flex items-center gap-2 text-sm text-gray-600'>
							<span>Bộ lọc hiện tại:</span>
							{searchParams.get('search') && (
								<span className='bg-main/10 text-main px-3 py-1 rounded-full'>
									Tìm kiếm: "{searchParams.get('search')}"
								</span>
							)}
							{searchParams.get('orderByPrice') && (
								<span className='bg-accent/10 text-accent px-3 py-1 rounded-full'>
									{getSortButtonText()}
								</span>
							)}
							<button
								onClick={() => router.push(pathname)}
								className='text-red-500 hover:text-red-700 text-sm underline'
							>
								Xóa tất cả
							</button>
						</div>
					</div>
				)}

				{/* Service List */}
				<ServiceList />
			</motion.div>
		</div>
	)
}
