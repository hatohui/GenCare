import { useState } from 'react'
import { useRouter } from 'next/navigation'
// import { useForm } from 'react-hook-form'
import { z } from 'zod'
// import { zodResolver } from '@hookform/resolvers/zod'

const bookingSchema = z.object({
	name: z.string().min(1, 'Name is required'),
	phone: z.string().min(1, 'Phone is required'),
	note: z.string().optional(),
})

type BookingFormData = z.infer<typeof bookingSchema>

export default function BookingPage({ params }: { params: { id: string } }) {
	const router = useRouter()
	const [selectedDate, setSelectedDate] = useState<Date | undefined>()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<BookingFormData>({
		resolver: zodResolver(bookingSchema),
	})

	const onSubmit = async (data: BookingFormData) => {
		if (!selectedDate) {
			alert('Please select a date.')
			return
		}

		const payload = {
			serviceId: params.id,
			...data,
			date: selectedDate,
		}

		try {
			const res = await fetch('/api/bookings', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			})

			if (res.ok) {
				router.push('/booking/success')
			} else {
				alert('Failed to book appointment.')
			}
		} catch (err) {
			console.error(err)
			alert('Something went wrong.')
		}
	}

	return (
		<div className='max-w-2xl mx-auto p-4 space-y-6'>
			<h1 className='text-2xl font-bold'>Book Appointment</h1>
			<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
				<Card>
					<CardContent className='space-y-4'>
						<div>
							<label className='block font-medium'>Full Name</label>
							<Input {...register('name')} placeholder='Your name' />
							{errors.name && (
								<p className='text-red-500 text-sm'>{errors.name.message}</p>
							)}
						</div>

						<div>
							<label className='block font-medium'>Phone Number</label>
							<Input {...register('phone')} placeholder='Your phone number' />
							{errors.phone && (
								<p className='text-red-500 text-sm'>{errors.phone.message}</p>
							)}
						</div>

						<div>
							<label className='block font-medium'>Preferred Date</label>
							<Calendar selected={selectedDate} onSelect={setSelectedDate} />
							{!selectedDate && (
								<p className='text-red-500 text-sm'>Please choose a date</p>
							)}
						</div>

						<div>
							<label className='block font-medium'>Symptoms or Notes</label>
							<Textarea
								{...register('note')}
								placeholder='Describe your symptoms or questions...'
							/>
						</div>

						<div className='text-right'>
							<Button type='submit'>Confirm Booking</Button>
						</div>
					</CardContent>
				</Card>
			</form>
		</div>
	)
}
