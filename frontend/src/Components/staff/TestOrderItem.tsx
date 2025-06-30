import React, { useState } from 'react'
import { BookedService } from '@/Interfaces/Payment/Types/BookService'
import { AnimatePresence, motion } from 'motion/react'
import LoadingIcon from '../LoadingIcon'
import {
	CheckCircleSVG,
	XCircleSVG,
	ChevronDownSVG,
	ChevronUpSVG,
} from '../SVGs'
import clsx from 'clsx'
import TestResultEditModal from './TestResultEditModal'

interface TestOrderItemProps {
	purchase: BookedService
}

const TestOrderItem: React.FC<TestOrderItemProps> = ({ purchase }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [editOrderId, setEditOrderId] = useState<string | null>(null)

	return (
		<div className='w-full'>
			{/* Main Card */}
			<motion.div
				whileHover={{
					scale: 1.01,
					boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
				}}
				transition={{ duration: 0.3 }}
				className='bg-white border border-gray-200 rounded-[30px] p-6 hover:border-accent/50 transition-all duration-300'
			>
				{/* Header */}
				<div className='flex flex-col gap-4'>
					<div className='flex justify-between items-start'>
						<div className='flex-1'>
							<div className='flex items-center gap-3 mb-2'>
								<h3 className='text-lg font-bold text-gray-900'>
									Mã giao dịch: {purchase.purchaseId}
								</h3>
								<div
									className={clsx(
										'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
										purchase.isPaid
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									)}
								>
									{purchase.isPaid ? (
										<CheckCircleSVG className='size-3' />
									) : (
										<XCircleSVG className='size-3' />
									)}
									{purchase.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
								</div>
							</div>
							<p className='text-2xl font-bold text-main'>
								{purchase.price.toLocaleString('vi-VN')} VND
							</p>
						</div>
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className='p-2 rounded-full hover:bg-gray-100 transition-colors'
								aria-label={isOpen ? 'Thu gọn' : 'Mở rộng'}
							>
								{isOpen ? (
									<ChevronUpSVG className='size-5 text-gray-600' />
								) : (
									<ChevronDownSVG className='size-5 text-gray-600' />
								)}
							</button>
						</div>
					</div>
					<div className='flex items-center gap-2 text-sm text-gray-600'>
						<span className='font-medium'>{purchase.order.length}</span>
						<span>xét nghiệm đã đặt</span>
					</div>
				</div>
				{/* Expandable Content */}
				<AnimatePresence>
					{isOpen && (
						<motion.div
							key='expandable-content'
							initial={{ opacity: 0, height: 0 }}
							animate={{ opacity: 1, height: 'auto' }}
							exit={{ opacity: 0, height: 0 }}
							transition={{ duration: 0.3 }}
							className='mt-6 pt-6 border-t border-gray-200'
						>
							<h4 className='font-semibold text-gray-800 mb-4 flex items-center gap-2'>
								Chi tiết xét nghiệm:
							</h4>
							<div className='grid gap-4 max-h-[400px] overflow-auto pr-2'>
								{purchase.order.map((order, index) => (
									<motion.div
										layout
										key={order.orderDetailId}
										initial={{ opacity: 0, y: 20 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ delay: index * 0.1 }}
										className='bg-gray-50 border border-gray-200 p-4 rounded-[20px] hover:bg-gray-100 transition-colors'
									>
										<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													Xét nghiệm:
												</p>
												<p className='text-sm text-gray-900 font-semibold'>
													{order.serviceName}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													Khách hàng:
												</p>
												<p className='text-sm text-gray-900'>
													{order.firstName} {order.lastName}
												</p>
											</div>
											<div>
												<p className='text-sm font-medium text-gray-700 mb-1'>
													Ngày đặt:
												</p>
												<p className='text-sm text-gray-900'>
													{order.createdAt
														? new Date(order.createdAt).toLocaleDateString(
																'vi-VN'
														  )
														: '-'}
												</p>
											</div>
											<div>
												<button
													className='text-blue-600 underline hover:text-accent transition font-medium mt-2'
													onClick={() => setEditOrderId(order.orderDetailId)}
												>
													Chỉnh sửa kết quả
												</button>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<TestResultEditModal
				isOpen={!!editOrderId}
				onClose={() => setEditOrderId(null)}
				orderDetailId={editOrderId}
			/>
		</div>
	)
}

export default TestOrderItem
