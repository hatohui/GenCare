'use client'
import { motion } from 'motion/react'
import { BookingListVSG } from '../SVGs'
import { useRouter } from 'next/navigation'
import useToken from '@/Hooks/Auth/useToken'
import { useLocale } from '@/Hooks/useLocale'

export const BookingButton = () => {
	const { t } = useLocale()
	const router = useRouter()
	const { accessToken } = useToken()

	if (!accessToken) return null

	return (
		<motion.button
			initial='rest'
			whileHover='hover'
			animate='rest'
			className='flex items-center justify-center bg-accent text-white px-4 py-2 rounded-full overflow-hidden hover:cursor-pointer'
			onClick={() => {
				router.push('/app/booking')
			}}
		>
			<motion.span
				variants={{
					rest: { opacity: 0, x: 0, width: 0 },
					hover: { opacity: 1, x: 0, width: 150 },
				}}
				transition={{ duration: 0.3 }}
				className='whitespace-nowrap font-medium text-sm'
			>
				{t('service.my_bookings')}
			</motion.span>
			<BookingListVSG className='size-7 hover:scale-110 duration-150' />
		</motion.button>
	)
}
