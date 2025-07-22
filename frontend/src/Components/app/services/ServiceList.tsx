'use client'

import { useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Pagination from '@/Components/Management/Pagination'
import { ServiceCard } from '@/Components/Services/ServiceCard'
import LoadingIcon from '@/Components/LoadingIcon'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

const ServiceList = () => {
	const { t } = useLocale()
	const searchParams = useSearchParams()
	const [page, setPage] = useState<number>(1)
	const [orderByPrice, setOrderByPrice] = useState<boolean | null>(null)
	const [search, setSearch] = useState<string>('')
	const itemsPerPage = 6

	useEffect(() => {
		setOrderByPrice(
			searchParams?.get('orderByPrice') === 'true'
				? true
				: searchParams?.get('orderByPrice') === 'false'
				? false
				: null
		)
		setSearch(searchParams?.get('search') ?? '')
	}, [searchParams])

	const { isError, isFetching, data, error } = useServiceByPage(
		page ? page : 0,
		itemsPerPage,
		orderByPrice,
		search
	)

	const pageCount = data?.totalCount
		? Math.ceil(data.totalCount / itemsPerPage)
		: 0

	// Handle errors
	useEffect(() => {
		if (isError && error) {
			console.error('Service fetch error:', error)
			toast.error(t('service.error.load_list'))
		}
	}, [isError, error, t])

	// Loading state
	if (isFetching && !data) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>{t('service.loading')}</p>
				</div>
			</div>
		)
	}

	// Error state
	if (isError) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-red-500 text-6xl mb-4'>⚠️</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('service.error.load_service')}
					</h3>
					<p className='text-gray-600 mb-4'>
						{t('service.error.load_service_description')}
					</p>
					<button
						onClick={() => window.location.reload()}
						className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
					>
						{t('service.try_again')}
					</button>
				</div>
			</div>
		)
	}

	// Empty state
	if (!data?.services || data.services.length === 0) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-gray-400 text-6xl mb-4'>🔍</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('service.no_services_found')}
					</h3>
					<p className='text-gray-600 mb-6'>
						{search || orderByPrice !== null
							? t('service.no_services_description')
							: t('service.no_services_available')}
					</p>
					{(search || orderByPrice !== null) && (
						<button
							onClick={() => (window.location.href = '/app/service')}
							className='bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors shadow-sm'
						>
							{t('service.clear_filters')}
						</button>
					)}
				</div>
			</div>
		)
	}

	return (
		<div className='space-y-8'>
			{/* Results Info */}
			<div className='flex justify-between items-center'>
				<div className='text-sm text-gray-600'>
					{t('service.showing', {
						'0': ((page - 1) * itemsPerPage + 1).toString(),
						'1': Math.min(
							page * itemsPerPage,
							data?.totalCount || 0
						).toString(),
						'2': (data?.totalCount || 0).toString(),
					})}
				</div>
				{pageCount > 1 && (
					<div className='text-sm text-gray-600'>
						{t('service.page', {
							'0': page.toString(),
							'1': pageCount.toString(),
						})}
					</div>
				)}
			</div>

			{/* Services Grid */}
			<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
				{data?.services.map((item, index) => (
					<motion.div
						key={item.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							delay: index * 0.1,
							duration: 0.5,
						}}
						className='h-full'
					>
						<ServiceCard service={item} />
					</motion.div>
				))}
			</div>

			{/* Pagination */}

			<div className='flex justify-center pt-8'>
				<Pagination
					currentPage={page}
					isFetching={isFetching}
					setCurrentPage={setPage}
					totalCount={data?.totalCount || 0}
					itemsPerPage={itemsPerPage}
				/>
			</div>

			{/* Loading overlay for subsequent fetches */}
			{isFetching && data && (
				<div className='fixed inset-0 bg-black/20 flex items-center justify-center z-50'>
					<div className='bg-white rounded-[20px] p-6 shadow-lg'>
						<div className='flex items-center gap-3'>
							<LoadingIcon className='size-6' />
							<span className='text-gray-700'>
								{t('service.showing_loading')}
							</span>
						</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default ServiceList
