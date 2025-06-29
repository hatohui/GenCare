'use client'

import React from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useServiceById } from '@/Services/service-services'
import {
	BookServiceFormProps,
	formSchema,
	FormSchema,
} from '@/Interfaces/Payment/schema/BookService'
import { useBookServices } from '@/Services/book-service'
import { TrashCanSVG } from '@/Components/SVGs'
import LoadingIcon from '@/Components/LoadingIcon'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'

const BookServiceForm: React.FC<BookServiceFormProps> = ({ serviceId }) => {
	const { data, isLoading } = useServiceById(serviceId)
	const updateBooking = useBookServices()
	const router = useRouter()

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

	const onSubmit = async (data: FormSchema) => {
		try {
			await updateBooking.mutateAsync({ OrderDetails: data.people })
			toast.success('Đặt dịch vụ thành công!')
			router.push('/app/booking')
		} catch (error) {
			console.error('Booking failed:', error)
			toast.error('Đặt dịch vụ thất bại. Vui lòng thử lại.')
		}
	}

	if (isLoading || !data) {
		return (
			<div className='flex items-center justify-center py-20'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>Đang tải thông tin dịch vụ...</p>
				</div>
			</div>
		)
	}

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
							← Quay lại
						</button>
					</li>
					<li>/</li>
					<li className='text-main font-medium'>Đặt dịch vụ</li>
				</ol>
			</nav>

			<motion.form
				onSubmit={handleSubmit(onSubmit)}
				className='space-y-6'
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ type: 'spring', stiffness: 50 }}
			>
				<div className='text-center mb-8'>
					<h2 className='text-3xl font-bold text-main mb-2'>Đặt Dịch Vụ</h2>
					<p className='text-gray-600'>
						Vui lòng điền thông tin chi tiết bên dưới
					</p>
				</div>

				{/* Service Info Card */}
				<div className='bg-gradient-to-r from-main/10 to-secondary/10 rounded-[30px] p-6 mb-8'>
					<h3 className='text-xl font-semibold text-main mb-2'>
						Thông Tin Dịch Vụ
					</h3>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Tên dịch vụ
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
								Giá dịch vụ
							</label>
							<input
								type='text'
								value={`${data.price.toLocaleString('vi-VN')} VND`}
								readOnly
								className='w-full bg-white border border-gray-300 rounded-[30px] px-4 py-3 text-gray-700'
							/>
						</div>
					</div>
				</div>

				{/* People Forms */}
				{fields.map((field, index) => (
					<motion.div
						key={field.id}
						className='bg-white border border-gray-200 rounded-[30px] p-6 shadow-sm relative'
						initial={{ y: -10, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ type: 'spring', stiffness: 100, delay: index * 0.1 }}
					>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='text-lg font-semibold text-main'>
								Người {index + 1}
							</h3>
							{fields.length > 1 && (
								<button
									type='button'
									onClick={() => remove(index)}
									className='text-red-500 hover:bg-red-50 rounded-full p-2 transition-colors'
									title='Xóa người này'
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
									Họ <span className='text-red-500'>*</span>
								</label>
								<input
									type='text'
									{...register(`people.${index}.lastName`)}
									className={`w-full border rounded-[30px] px-4 py-3 transition-colors ${
										errors.people?.[index]?.lastName
											? 'border-red-500 focus:border-red-500'
											: 'border-gray-300 focus:border-main'
									}`}
									placeholder='Nguyễn'
								/>
								{errors.people?.[index]?.lastName && (
									<p className='text-red-500 text-sm mt-1'>
										{errors.people[index]?.lastName?.message}
									</p>
								)}
							</div>

							<div>
								<label className='block text-sm font-medium text-gray-700 mb-1'>
									Tên <span className='text-red-500'>*</span>
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
									Số điện thoại <span className='text-red-500'>*</span>
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
									Ngày sinh <span className='text-red-500'>*</span>
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
									Giới tính <span className='text-red-500'>*</span>
								</label>
								<select
									{...register(`people.${index}.gender`, {
										setValueAs: (v: string): boolean => v === 'true',
									})}
									className='w-full border border-gray-300 rounded-[30px] px-4 py-3 focus:border-main transition-colors'
								>
									<option value='true'>Nam</option>
									<option value='false'>Nữ</option>
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
						+ Thêm người khác
					</button>
				</div>

				{/* Submit Button */}
				<div className='text-center pt-6'>
					<button
						type='submit'
						disabled={isSubmitting || updateBooking.isPending}
						className={`px-8 py-4 rounded-[30px] text-lg font-semibold text-white transition-all ${
							isSubmitting || updateBooking.isPending
								? 'bg-gray-400 cursor-not-allowed'
								: 'bg-accent hover:bg-accent/90 shadow-lg hover:shadow-xl'
						}`}
					>
						{isSubmitting || updateBooking.isPending ? (
							<div className='flex items-center justify-center'>
								<LoadingIcon className='size-5 mr-2' />
								Đang xử lý...
							</div>
						) : (
							'Xác nhận đặt dịch vụ'
						)}
					</button>
				</div>
			</motion.form>
		</div>
	)
}

export default BookServiceForm
