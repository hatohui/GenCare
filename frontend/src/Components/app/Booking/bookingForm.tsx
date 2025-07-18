'use client'

import React, { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServiceById } from '@/Services/service-services'
import {
	BookServiceFormProps,
	formSchema,
	FormSchema,
} from '@/Interfaces/Payment/schema/BookService'
import {
	useBookServices,
	useMomoPay,
	useVnpayPay,
} from '@/Services/book-service'
import { TrashCanSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { toast } from 'react-hot-toast'
import { useLocale } from '@/Hooks/useLocale'

const BookServiceForm: React.FC<BookServiceFormProps> = ({ serviceId }) => {
	const { data, isLoading } = useServiceById(serviceId)
	const { t } = useLocale()
	const updateBooking = useBookServices()
	const router = useRouter()
	const [paymentMethod, setPaymentMethod] = useState<
		'momo' | 'vnpay' | 'later'
	>('later')
	const [showPaymentOptions, setShowPaymentOptions] = useState(false)

	const {
		register,
		control,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<FormSchema>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			people: [
				{
					firstName: '',
					lastName: '',
					phoneNumber: '',
					dateOfBirth: '',
					gender: false,
					serviceId: serviceId,
				},
			],
		},
	})

	const { fields, append, remove } = useFieldArray({
		control,
		name: 'people',
	})

	const momoPayMutation = useMomoPay()
	const vnpayPayMutation = useVnpayPay()

	const onSubmit = async (formData: FormSchema) => {
		try {
			const result = await updateBooking.mutateAsync({
				OrderDetails: formData.people,
			})
			const purchaseId = result.purchaseId || result.id
			if (paymentMethod === 'momo') {
				if (!purchaseId) {
					toast.error(t('payment.payment_required'))
					return
				}
				await new Promise(res => setTimeout(res, 800))
				try {
					const momoResult = await momoPayMutation.mutateAsync(purchaseId)
					if (momoResult.payUrl) {
						window.location.href = momoResult.payUrl
					} else {
						toast.error(t('payment.payment_link_failed'))
					}
				} catch (error) {
					console.error('MoMo payment failed:', error)
					toast.error(t('payment.payment_failed'))
				}
			} else if (paymentMethod === 'vnpay') {
				if (!purchaseId) {
					toast.error('Không tìm thấy thông tin đặt dịch vụ')
					return
				}
				await new Promise(res => setTimeout(res, 800))
				try {
					const vnpayResult = await vnpayPayMutation.mutateAsync(purchaseId)
					if (vnpayResult) {
						window.location.href = vnpayResult
					} else {
						toast.error('Không thể tạo liên kết thanh toán')
					}
				} catch (error) {
					console.error('VNPay payment failed:', error)
					toast.error('Thanh toán VNPay thất bại. Vui lòng thử lại.')
				}
			} else {
				toast.success(t('booking.booking_success'))
				router.push('/app/booking')
			}
		} catch (error) {
			console.error('Booking failed:', error)
			toast.error(t('booking.booking_failed'))
		}
	}

	const handlePayLater = () => {
		toast.success(t('booking.booking_success'))
		router.push('/app/booking')
	}

	if (isLoading || !data) {
		return (
			<div className='flex items-center justify-center py-20'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>{t('booking.loading_service')}</p>
				</div>
			</div>
		)
	}

	// Calculate total price
	const totalPrice = data.price * fields.length

	return (
		<div className='max-w-4xl mx-auto p-6'>
			{/* Breadcrumb */}
			<nav className='mb-6'>
				<ol className='flex items-center space-x-2 text-sm text-gray-600'>
					<li>
						<button
							onClick={() => router.back()}
							className='hover:text-main transition-colors'
						>
							← {t('booking.go_back')}
						</button>
					</li>
					<li>/</li>
					<li className='text-main font-medium'>{t('booking.form_title')}</li>
				</ol>
			</nav>

			{!showPaymentOptions ? (
				<motion.form
					onSubmit={handleSubmit(onSubmit)}
					className='space-y-6'
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ type: 'spring', stiffness: 50 }}
				>
					<div className='text-center mb-8'>
						<h2 className='text-3xl font-bold text-main mb-2'>
							{t('booking.form_title')}
						</h2>
						<p className='text-gray-600'>{t('booking.form_description')}</p>
					</div>

					{/* Service Info Card */}
					<div className='bg-gradient-to-r from-main/10 to-secondary/10 rounded-[30px] p-6 mb-8'>
						<h3 className='text-xl font-semibold text-main mb-2'>
							{t('booking.service_info')}
						</h3>
						<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									{t('booking.service_name')}
								</label>
								<input
									type='text'
									value={data.name}
									readOnly
									className='w-full bg-white border border-gray-300 rounded-[30px] px-4 py-3 text-gray-700'
								/>
							</div>
							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									{t('booking.service_price')}
								</label>
								<input
									type='text'
									value={`${data.price.toLocaleString('vi-VN')} VND`}
									readOnly
									className='w-full bg-white border border-gray-300 rounded-[30px] px-4 py-3 text-gray-700'
								/>
							</div>
						</div>
						<div className='mt-4 p-4 bg-white rounded-[20px] border border-gray-200'>
							<div className='flex justify-between items-center'>
								<span className='text-lg font-semibold text-gray-700'>
									{t('booking.total')}:
								</span>
								<span className='text-2xl font-bold text-main'>
									{totalPrice.toLocaleString('vi-VN')} VND
								</span>
							</div>
							<p className='text-sm text-gray-600 mt-1'>
								({fields.length} {t('booking.people')} ×{' '}
								{data.price.toLocaleString('vi-VN')} VND)
							</p>
						</div>
					</div>

					{/* Payment Method Selection */}
					<div className='bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm'>
						<h3 className='text-lg font-semibold text-main mb-4'>
							{t('booking.payment_method')}
						</h3>
						<div className='space-y-3'>
							<label className='flex items-center space-x-3 cursor-pointer'>
								<input
									type='radio'
									name='paymentMethod'
									value='momo'
									checked={paymentMethod === 'momo'}
									onChange={() => setPaymentMethod('momo')}
									className='text-main focus:ring-main'
								/>
								<div className='flex items-center space-x-2'>
									<div className='w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center'>
										<span className='text-white font-bold text-sm'>M</span>
									</div>
									<span className='font-medium'>
										{t('booking.pay_with_momo')}
									</span>
								</div>
							</label>
							<label className='flex items-center space-x-3 cursor-pointer'>
								<input
									type='radio'
									name='paymentMethod'
									value='vnpay'
									checked={paymentMethod === 'vnpay'}
									onChange={() => setPaymentMethod('vnpay')}
									className='text-main focus:ring-main'
								/>
								<div className='flex items-center space-x-2'>
									<div className='w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center'>
										<span className='text-white font-bold text-sm'>V</span>
									</div>
									<span className='font-medium'>Thanh toán ngay với VNPay</span>
								</div>
							</label>
							<label className='flex items-center space-x-3 cursor-pointer'>
								<input
									type='radio'
									name='paymentMethod'
									value='later'
									checked={paymentMethod === 'later'}
									onChange={() => setPaymentMethod('later')}
									className='text-main focus:ring-main'
								/>
								<div className='flex items-center space-x-2'>
									<div className='w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center'>
										<span className='text-white font-bold text-sm'>$</span>
									</div>
									<span className='font-medium'>{t('booking.pay_later')}</span>
								</div>
							</label>
						</div>
						{paymentMethod === 'momo' && (
							<div className='mt-3 p-3 bg-pink-50 border border-pink-200 rounded-[15px]'>
								<p className='text-sm text-pink-700'>
									{t('booking.momo_description')}
									{t('booking.momo_description2')}
								</p>
							</div>
						)}
						{paymentMethod === 'vnpay' && (
							<div className='mt-3 p-3 bg-blue-50 border border-blue-200 rounded-[15px]'>
								<p className='text-sm text-blue-700'>
									Bạn sẽ được chuyển đến trang thanh toán VNPay sau khi xác nhận
									đặt dịch vụ.
								</p>
							</div>
						)}
						{paymentMethod === 'later' && (
							<div className='mt-3 p-3 bg-gray-50 border border-gray-200 rounded-[15px]'>
								<p className='text-sm text-gray-700'>
									{t('booking.pay_later_description')}
								</p>
							</div>
						)}
					</div>

					{/* People Forms */}
					{fields.map((field, index) => (
						<motion.div
							key={field.id}
							className='bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm relative'
							initial={{ y: -10, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{
								type: 'spring',
								stiffness: 100,
								delay: index * 0.1,
							}}
						>
							<div className='flex justify-between items-center mb-4'>
								<h3 className='text-lg font-semibold text-main'>
									{t('booking.person')} {index + 1}
								</h3>
								{fields.length > 1 && (
									<button
										type='button'
										onClick={() => remove(index)}
										className='text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors'
										title={t('booking.remove_person')}
									>
										<TrashCanSVG className='size-5' />
									</button>
								)}
							</div>

							{/* Hidden service ID */}
							<input
								type='hidden'
								{...register(`people.${index}.serviceId`)}
								value={serviceId}
							/>

							<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t('booking.last_name')}{' '}
										<span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										{...register(`people.${index}.lastName`)}
										className={`w-full border rounded-[30px] px-4 py-3 transition-colors ${
											errors.people?.[index]?.lastName
												? 'border-red-500 focus:border-red-500'
												: 'border-gray-300 focus:border-main'
										}`}
										placeholder={t('booking.last_name')}
									/>
									{errors.people?.[index]?.lastName && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.people[index]?.lastName?.message}
										</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t('booking.first_name')}{' '}
										<span className='text-red-500'>*</span>
									</label>
									<input
										type='text'
										{...register(`people.${index}.firstName`)}
										className={`w-full border rounded-[30px] px-4 py-3 transition-colors ${
											errors.people?.[index]?.firstName
												? 'border-red-500 focus:border-red-500'
												: 'border-gray-300 focus:border-main'
										}`}
										placeholder='Văn A'
									/>
									{errors.people?.[index]?.firstName && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.people[index]?.firstName?.message}
										</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t('booking.phone_number')}{' '}
										<span className='text-red-500'>*</span>
									</label>
									<input
										type='tel'
										{...register(`people.${index}.phoneNumber`)}
										className={`w-full border rounded-[30px] px-4 py-3 transition-colors ${
											errors.people?.[index]?.phoneNumber
												? 'border-red-500 focus:border-red-500'
												: 'border-gray-300 focus:border-main'
										}`}
										placeholder='0912345678'
									/>
									{errors.people?.[index]?.phoneNumber && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.people[index]?.phoneNumber?.message}
										</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t('booking.date_of_birth')}{' '}
										<span className='text-red-500'>*</span>
									</label>
									<input
										type='date'
										{...register(`people.${index}.dateOfBirth`)}
										className={`w-full border rounded-[30px] px-4 py-3 transition-colors ${
											errors.people?.[index]?.dateOfBirth
												? 'border-red-500 focus:border-red-500'
												: 'border-gray-300 focus:border-main'
										}`}
									/>
									{errors.people?.[index]?.dateOfBirth && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.people[index]?.dateOfBirth?.message}
										</p>
									)}
								</div>

								<div>
									<label className='block text-sm font-medium text-gray-700 mb-1'>
										{t('booking.gender')}{' '}
										<span className='text-red-500'>*</span>
									</label>
									<select
										{...register(`people.${index}.gender`, {
											setValueAs: (v: string): boolean => v === 'true',
										})}
										className='w-full border border-gray-300 rounded-[30px] px-4 py-3 focus:border-main transition-colors'
									>
										<option value='true'>{t('booking.gender_male')}</option>
										<option value='false'>{t('booking.gender_female')}</option>
									</select>
									{errors.people?.[index]?.gender && (
										<p className='text-red-500 text-sm mt-1'>
											{errors.people[index]?.gender?.message}
										</p>
									)}
								</div>
							</div>
						</motion.div>
					))}

					{/* Add Person Button */}
					<div className='text-center'>
						<button
							type='button'
							onClick={() =>
								append({
									firstName: '',
									lastName: '',
									phoneNumber: '',
									dateOfBirth: '',
									gender: true,
									serviceId: serviceId,
								})
							}
							className='bg-main hover:bg-main/90 text-white px-6 py-3 rounded-[30px] font-medium transition-colors'
						>
							+ {t('booking.add_person')}
						</button>
					</div>

					{/* Submit Button */}
					<div className='text-center pt-6'>
						<button
							type='submit'
							disabled={
								isSubmitting ||
								updateBooking.isPending ||
								momoPayMutation.isPending ||
								vnpayPayMutation.isPending
							}
							className={`px-8 py-4 rounded-[30px] text-lg font-semibold text-white transition-all ${
								isSubmitting ||
								updateBooking.isPending ||
								momoPayMutation.isPending ||
								vnpayPayMutation.isPending
									? 'bg-gray-400 cursor-not-allowed'
									: 'bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl'
							}`}
						>
							{isSubmitting ||
							updateBooking.isPending ||
							momoPayMutation.isPending ||
							vnpayPayMutation.isPending ? (
								<div className='flex items-center justify-center'>
									<LoadingIcon className='size-5 mr-2' />
									{t('payment.processing')}
								</div>
							) : (
								t('booking.confirm_booking')
							)}
						</button>
					</div>
				</motion.form>
			) : (
				// Payment Options Screen
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className='space-y-6'
				>
					<div className='text-center mb-8'>
						<h2 className='text-3xl font-bold text-main mb-2'>
							{t('booking.payment')}
						</h2>
						<p className='text-gray-600'>
							{t('booking.select_payment_method')}
						</p>
					</div>

					<div className='bg-white border border-gray-200 rounded-[30px] p-8 shadow-sm'>
						<div className='text-center mb-6'>
							<h3 className='text-xl font-semibold text-main mb-2'>
								{t('booking.booking_info')}
							</h3>
							<p className='text-gray-600'>
								{t('booking.service')}: {data.name} -{' '}
								{totalPrice.toLocaleString('vi-VN')} VND
							</p>
						</div>

						<div className='grid grid-cols-1 gap-4 mb-6'>
							<button
								onClick={handlePayLater}
								className='flex items-center justify-center space-x-3 p-6 border-2 border-gray-300 rounded-[20px] hover:bg-gray-50 transition-colors'
							>
								<div className='w-12 h-12 bg-gray-500 rounded-full flex items-center justify-center'>
									<span className='text-white font-bold text-lg'>$</span>
								</div>
								<div className='text-left'>
									<h4 className='font-semibold text-gray-800'>
										{t('booking.pay_later')}
									</h4>
									<p className='text-sm text-gray-600'>
										{t('booking.pay_when_convenient')}
									</p>
								</div>
							</button>
						</div>

						<div className='text-center'>
							{' '}
							<button
								onClick={() => setShowPaymentOptions(false)}
								className='text-gray-600 hover:text-main transition-colors'
							>
								← {t('booking.go_back')}
							</button>
						</div>
					</div>
				</motion.div>
			)}
		</div>
	)
}

export default BookServiceForm
