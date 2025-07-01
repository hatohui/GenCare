'use client'
import AddNewButton from '@/Components/Management/AddNewButton'
import AddNewSlotForm from '@/Components/Management/AddNewSlotForm'
import SlotList from '@/Components/Management/SlotList'
import {
	useDeleteSlot,
	useAllSlotsAdmin,
	useUpdateSlot,
} from '@/Services/slot-services'
import clsx from 'clsx'
import React, { useState } from 'react'

const SlotsPage = () => {
	const deleteMutation = useDeleteSlot()
	const updateMutation = useUpdateSlot()

	const query = useAllSlotsAdmin()

	const { isError, isFetching, data, isLoading } = query
	const [isAddNewOpen, setIsAddNewOpen] = useState(false)

	const handleDelete = (id: string) => {
		if (window.confirm('Bạn có muốn xóa slot này không?'))
			deleteMutation.mutate(id, {
				onSuccess: () => {
					query.refetch()
				},
				onError: () => {},
			})
	}

	const handleRestore = (id: string) => {
		if (window.confirm('Bạn có muốn khôi phục slot này không?'))
			updateMutation.mutate(
				{ id, data: { isDeleted: false } },
				{
					onSuccess: () => {
						query.refetch()
					},
					onError: () => {},
				}
			)
	}

	return (
		<>
			{isAddNewOpen && (
				<div className='h-full w-full absolute  '>
					<AddNewSlotForm
						className='z-20'
						onSuccess={() => query.refetch()}
						onClose={() => setIsAddNewOpen(false)}
					/>
				</div>
			)}

			<section
				className={clsx(
					'flex w-full h-full flex-col gap-4 select-none md:gap-5'
				)}
				aria-label='Slot Management'
			>
				<div className='w-full flex gap-3 px-1'>
					<div className='w-full'>
						<div className='flex items-center justify-between px-5 gap-3 grow shadow-sm bg-general py-3 rounded overflow-hidden'>
							<h1 className='text-xl font-semibold text-gray-800'>
								Slot Management
							</h1>
							<AddNewButton
								handleAddNew={() => setIsAddNewOpen(!isAddNewOpen)}
							/>
						</div>
					</div>
				</div>

				{isLoading || isFetching ? (
					<div className='h-full center-all w-full animate-pulse'>
						<div className='text-center'>
							<div className='animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4'></div>
							<p className='text-gray-600'>Loading slots...</p>
						</div>
					</div>
				) : isError ? (
					<div className='h-full center-all w-full'>
						<div className='text-red-500 text-center'>
							<p className='text-lg font-semibold mb-2'>
								⚠️ Error loading slots
							</p>
							<p className='text-sm'>
								Unable to fetch slot data. Please try again.
							</p>
							<button
								onClick={() => query.refetch()}
								className='mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors'
							>
								Retry
							</button>
						</div>
					</div>
				) : !data?.data?.slots || data.data.slots.length === 0 ? (
					<div className='h-full center-all w-full'>
						<div className='text-center text-gray-500'>
							<div className='mb-4'>
								<svg
									className='mx-auto h-16 w-16 text-gray-300'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={1}
										d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z'
									/>
								</svg>
							</div>
							<h3 className='text-lg font-medium text-gray-900 mb-2'>
								No slots found
							</h3>
							<p className='text-sm text-gray-500 mb-6'>
								Get started by creating your first slot.
							</p>
							<button
								onClick={() => setIsAddNewOpen(true)}
								className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
							>
								<svg
									className='-ml-1 mr-2 h-5 w-5'
									fill='none'
									viewBox='0 0 24 24'
									stroke='currentColor'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M12 6v6m0 0v6m0-6h6m-6 0H6'
									/>
								</svg>
								Add First Slot
							</button>
						</div>
					</div>
				) : (
					<SlotList
						data={data}
						handleDelete={handleDelete}
						handleRestore={handleRestore}
					/>
				)}
			</section>
		</>
	)
}

export default SlotsPage
