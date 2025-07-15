'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useCreateSlot } from '@/Services/slot-services'
import { useState } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'
import { CreateSlotRequest } from '@/Interfaces/Slot/Schema/slot'
import { z } from 'zod'
import { toast } from 'react-hot-toast'

// Define fixed time slots from 8am to 10pm (every 2 hours)
// Each slot has a fixed number: 8am-10am: 1, 10am-12pm: 2, etc.
const TIME_SLOTS = [
	{ value: '08:00', label: 'Slot 1: 8:00 AM - 10:00 AM', no: 1 },
	{ value: '10:00', label: 'Slot 2: 10:00 AM - 12:00 PM', no: 2 },
	{ value: '12:00', label: 'Slot 3: 12:00 PM - 2:00 PM', no: 3 },
	{ value: '14:00', label: 'Slot 4: 2:00 PM - 4:00 PM', no: 4 },
	{ value: '16:00', label: 'Slot 5: 4:00 PM - 6:00 PM', no: 5 },
	{ value: '18:00', label: 'Slot 6: 6:00 PM - 8:00 PM', no: 6 },
	{ value: '20:00', label: 'Slot 7: 8:00 PM - 10:00 PM', no: 7 },
]

const slotSchema = z.object({
	date: z.string().min(1, 'Date is required'),
	timeSlot: z.string().min(1, 'Time slot is required'),
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
			date: '',
			timeSlot: '',
			isDeleted: false,
		},
	})

	const onSubmit = (data: SlotFormSchema) => {
		setLoading(true)

		// Find the selected time slot
		const selectedTimeSlot = TIME_SLOTS.find(
			slot => slot.value === data.timeSlot
		)
		if (!selectedTimeSlot) {
			toast.error('Please select a valid time slot')
			setLoading(false)
			return
		}

		// Create start and end times by combining date with time slot
		const [startHour, startMinute] = data.timeSlot.split(':').map(Number)
		const endHour = startHour + 2

		// Create Date objects for precise time handling
		const startDate = new Date(data.date)
		startDate.setHours(startHour, startMinute, 0, 0)

		const endDate = new Date(data.date)
		endDate.setHours(endHour, 0, 0, 0)

		const slotData: CreateSlotRequest = {
			no: selectedTimeSlot.no, // Auto-assign slot number based on time slot
			startTime: startDate.toISOString(),
			endTime: endDate.toISOString(),
			isDeleted: data.isDeleted,
		}

		createMutation.mutate(slotData, {
			onSuccess: () => {
				reset()
				onSuccess?.()
				onClose?.()
				toast.success('Slot created successfully')
			},
			onError: error => {
				console.error('Failed to create slot:', error)
				toast.error('Failed to create slot')
			},
			onSettled: () => setLoading(false),
		})
	}

	return (
		<>
			{/* Overlay */}
			<motion.div
				className='fixed inset-0 bg-black/10 backdrop-blur-md z-40'
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
						'relative bg-white w-full p-4 max-w-md rounded-xl shadow-lg border border-gray-200',
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
						{/* Date */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Date
							</label>
							<input
								{...register('date')}
								type='date'
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
							/>
							{errors.date && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.date.message}
								</p>
							)}
						</div>

						{/* Time Slot */}
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Time Slot
							</label>
							<select
								{...register('timeSlot')}
								className='w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500'
							>
								<option value=''>Select a time slot</option>
								{TIME_SLOTS.map(slot => (
									<option key={slot.value} value={slot.value}>
										{slot.label}
									</option>
								))}
							</select>
							{errors.timeSlot && (
								<p className='text-sm text-red-500 mt-1'>
									{errors.timeSlot.message}
								</p>
							)}
						</div>

						<button
							type='submit'
							className='w-full bg-accent hover:bg-accent/90 text-white font-medium py-2 px-4 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed'
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
