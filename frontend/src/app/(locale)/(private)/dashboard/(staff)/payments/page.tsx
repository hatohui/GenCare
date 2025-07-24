'use client'

import SearchBar from '@/Components/Management/SearchBar'
import AccountList from '@/Components/staff/AccountList'
import { useLocale } from '@/Hooks/useLocale'
import { motion } from 'motion/react'

const Page = () => {
	const { t } = useLocale()
	return (
		<div className='max-w-7xl mx-auto p-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					{t('staff.payments.title')}
				</h1>
				<p className='text-gray-600'>{t('staff.payments.subtitle')}</p>
			</motion.div>

			{/* Search Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
				className='mb-8'
			>
				<div className='bg-white border border-gray-200 rounded-[20px] p-4 shadow-sm'>
					<div className='flex items-center gap-3'>
						<SearchBar className='flex-1' waitTime={1000} />
					</div>
				</div>
			</motion.div>

			{/* Account List */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
			>
				<AccountList />
			</motion.div>
		</div>
	)
}

export default Page
