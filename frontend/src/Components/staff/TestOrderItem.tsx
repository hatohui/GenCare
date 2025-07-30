import React, { useState } from 'react'
import { Result } from '@/Interfaces/Tests/Types/Tests'
import { AnimatePresence, motion } from 'motion/react'
import {
	CheckCircleSVG,
	XCircleSVG,
	ChevronDownSVG,
	ChevronUpSVG,
} from '../SVGs'
import clsx from 'clsx'
import TestResultEditModal from './TestResultEditModal'
import { useLocale } from '@/Hooks/useLocale'

interface TestOrderItemProps {
	result: Result
}

const TestOrderItem: React.FC<TestOrderItemProps> = ({ result }) => {
	const [isOpen, setIsOpen] = useState(false)
	const [editOrderId, setEditOrderId] = useState<string | null>(null)
	const { t } = useLocale()

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
									Mã xét nghiệm: {result.orderDetailId}
								</h3>
								<div
									className={clsx(
										'px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1',
										result.status
											? 'bg-green-100 text-green-800'
											: 'bg-yellow-100 text-yellow-800'
									)}
								>
									{result.status ? (
										<CheckCircleSVG className='size-3' />
									) : (
										<XCircleSVG className='size-3' />
									)}
									{result.status
										? t('test.status.completed')
										: t('test.status.incomplete')}
								</div>
							</div>
							<p className='text-sm text-gray-600'>
								{t('test.order_date')}: {result.orderDate.toLocaleDateString()}
							</p>
						</div>
						<div className='flex items-center gap-3'>
							<button
								onClick={() => setIsOpen(!isOpen)}
								className='p-2 rounded-full hover:bg-gray-100 transition-colors'
								aria-label={isOpen ? t('test.collapse') : t('test.expand')}
							>
								{isOpen ? (
									<ChevronUpSVG className='size-5 text-gray-600' />
								) : (
									<ChevronDownSVG className='size-5 text-gray-600' />
								)}
							</button>
						</div>
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
							<div className='grid gap-4'>
								<motion.div
									layout
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: 0.1 }}
									className='bg-gray-50 border border-gray-200 p-4 rounded-[20px] hover:bg-gray-100 transition-colors'
								>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
										<div>
											<p className='text-sm font-medium text-gray-700 mb-1'>
												Ngày lấy mẫu:
											</p>
											<p className='text-sm text-gray-900'>
												{result.sampleDate
													? result.sampleDate.toLocaleDateString('vi-VN')
													: 'Chưa có'}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-700 mb-1'>
												Ngày trả kết quả:
											</p>
											<p className='text-sm text-gray-900'>
												{result.resultDate
													? result.resultDate.toLocaleDateString('vi-VN')
													: 'Chưa có'}
											</p>
										</div>
										<div>
											<p className='text-sm font-medium text-gray-700 mb-1'>
												Cập nhật lần cuối:
											</p>
											<p className='text-sm text-gray-900'>
												{result.updatedAt
													? result.updatedAt.toLocaleDateString('vi-VN')
													: 'Chưa có'}
											</p>
										</div>
										<div>
											<button
												className='text-blue-600 underline hover:text-accent transition font-medium mt-2'
												onClick={() => setEditOrderId(result.orderDetailId)}
											>
												Chỉnh sửa kết quả
											</button>
										</div>
									</div>
									{result.resultData && (
										<div className='mt-4'>
											<p className='text-sm font-medium text-gray-700 mb-2'>
												Dữ liệu kết quả:
											</p>
											<pre className='text-xs bg-white p-2 rounded border overflow-auto max-h-32'>
												{JSON.stringify(result.resultData, null, 2)}
											</pre>
										</div>
									)}
								</motion.div>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</motion.div>
			<TestResultEditModal
				isOpen={!!editOrderId}
				onClose={() => setEditOrderId(null)}
				orderDetailId={editOrderId}
				useMock={false}
			/>
		</div>
	)
}

export default TestOrderItem
