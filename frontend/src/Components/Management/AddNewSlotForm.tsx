'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateSlot } from '@/Services/slot-services'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { CreateSlotRequest } from '@/Interfaces/Slot/Schema/slot'
import { z } from 'zod'

const slotSchema = z.object({
	no: z.coerce.number().positive('Slot number must be greater than 0'),
	startAt: z.string().min(1, 'Start time is required'),
	endAt: z.string().min(1, 'End time is required'),
	isDeleted: z.boolean(),
})

type SlotFormSchema = z.infer<typeof slotSchema>

interface Props {
	onSuccess?: () => void
	onClose?: () => void
	className?: string
}

const AddNewSlotForm = ({ onSuccess, onClose, className }: Props) => {
	const [loading, setLoading] = useState(false)
	const createMutation = useCreateSlot()

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm<SlotFormSchema>({
		resolver: zodResolver(slotSchema),
		defaultValues: {
			no: 1,
			startAt: '',
			endAt: '',
			isDeleted: false,
		},
	})

	const onSubmit = (data: SlotFormSchema) => {
		setLoading(true)
		// Convert datetime-local to ISO string
		const slotData: CreateSlotRequest = {
			no: data.no,
			startAt: new Date(data.startAt).toISOString(),
			endAt: new Date(data.endAt).toISOString(),
			isDeleted: data.isDeleted,
		}

		createMutation.mutate(slotData, {
			onSuccess: () => {
				reset()
				onSuccess?.()
				onClose?.()
			},
			onSettled: () => setLoading(false),
		})
	}

	return (
		<>
			{/* Overlay */}
			<motion.div
				className='fixed inset-0 bg-black/40 backdrop-blur-sm z-40'
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				onClick={onClose}
			/>

			{/* Modal */}
			<motion.div
				className='fixed inset-0 z-50 flex items-center justify-center px-4'
				initial={{ opacity: 0, scale: 0.95, y: -20 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.95, y: -20 }}
				transition={{ duration: 0.2, ease: 'easeOut' }}
			>
				<div
					className={clsx(
						'relative bg-white w-full max-w-md rounded-xl p-6 shadow-2xl border border-gray-200',
						className
					)}
					onClick={e => e.stopPropagation()}
				>
					{/* Close Button */}
					<button
						onClick={onClose}
						className='absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold'
						aria-label='Close'
					>
						×
					</button>

					<h2 className='text-2xl font-semibold mb-6 text-gray-800'>
						Add New Slot
					</h2>

					<form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
						{/* Slot Number */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Slot Number
							</label>
							<input
								{...register('no', { valueAsNumber: true })}
								type='number'
								min='1'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
								placeholder='Enter slot number'
							/>
							{errors.no && (
								<p className='text-sm text-red-500 mt-1'>{errors.no.message}</p>
							)}
						</div>

						{/* Start Time */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Start Time
							</label>
							<input
								{...register('startAt')}
								type='datetime-local'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
							{errors.startAt && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.startAt.message}
								</p>
							)}
						</div>

						{/* End Time */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								End Time
							</label>
							<input
								{...register('endAt')}
								type='datetime-local'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
							{errors.endAt && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.endAt.message}
								</p>
							)}
						</div>

						<button
							type='submit'
							className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed'
							disabled={loading}
						>
							{loading ? 'Creating...' : 'Create Slot'}
						</button>
					</form>
				</div>
			</motion.div>
		</>
	)
}

export default AddNewSlotForm
