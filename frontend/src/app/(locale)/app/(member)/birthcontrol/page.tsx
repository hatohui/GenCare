'use client'

import BirthControlForm from '@/Components/app/BirthControl/BirthControlForm'
import Calendar from '@/Components/app/BirthControl/Calender'
import { useAccountStore } from '@/Hooks/useAccount'
import { useBirthControl } from '@/Hooks/useBirthControl'
import { useGetBirthControl } from '@/Services/birthControl-service'
import React, { useEffect, useState } from 'react'
import LoadingIcon from '@/Components/LoadingIcon'
import { motion } from 'motion/react'
import { getMonth, getYear, format } from 'date-fns'
import { vi } from 'date-fns/locale'
import { useLocale } from '@/Hooks/useLocale'

const Page = () => {
	const { t } = useLocale()
	const { data: account, isLoading: accountLoading } = useAccountStore()
	const { data: getBirthControl, isLoading: birthControlLoading } =
		useGetBirthControl(account?.id || '')
	const { birthControl, setBirthControl } = useBirthControl()

	useEffect(() => {
		if (getBirthControl) setBirthControl(getBirthControl)
	}, [getBirthControl, setBirthControl])

	const now = new Date()
	const [month, setMonth] = useState(getMonth(now))
	const [year, setYear] = useState(getYear(now))

	const handlePreviousMonth = () => {
		if (month === 0) {
			setMonth(11)
			setYear(year - 1)
		} else {
			setMonth(month - 1)
		}
	}

	const handleNextMonth = () => {
		if (month === 11) {
			setMonth(0)
			setYear(year + 1)
		} else {
			setMonth(month + 1)
		}
	}

	if (accountLoading || birthControlLoading) {
		return (
			<div className='flex justify-center items-center min-h-[400px]'>
				<div className='text-center'>
					<LoadingIcon className='mx-auto mb-4' />
					<p className='text-gray-600'>
						{t('birthControl.loading_cycle_info')}
					</p>
				</div>
			</div>
		)
	}

	return (
		<div className='max-w-7xl mx-auto p-6 space-y-6'>
			{/* Header */}
			<motion.div
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className='text-center mb-8'
			>
				<h1 className='text-3xl font-bold text-main mb-2'>
					{t('birthControl.menstrual_cycle_prediction')}
				</h1>
				<p className='text-gray-600'>
					{t('birthControl.manage_track_cycle_safely')}
				</p>
			</motion.div>

			{/* Main Content */}
			{account ? (
				<div className='grid lg:grid-cols-3 gap-6'>
					{/* Form Section */}
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.1 }}
						className='lg:col-span-1'
					>
						<BirthControlForm accountID={account.id} />
					</motion.div>

					{/* Calendar Section */}
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
						className='lg:col-span-2'
					>
						<div className='bg-white p-6 rounded-[30px] shadow-sm border border-gray-200'>
							{/* Calendar Header */}
							<div className='flex items-center justify-between mb-6'>
								<h2 className='text-2xl font-bold text-main'>
									{t('birthControl.cycle_calendar')}
								</h2>
								<div className='flex items-center gap-3'>
									<button
										onClick={handlePreviousMonth}
										className='bg-main hover:bg-main/90 text-white px-4 py-2 rounded-[20px] transition-colors text-sm font-medium'
									>
										{t('birthControl.previous_month')}
									</button>
									<div className='text-lg font-semibold text-gray-800 min-w-[120px] text-center'>
										{format(new Date(year, month), 'MMMM', {
											locale: vi,
										})}{' '}
										{year}
									</div>
									<button
										onClick={handleNextMonth}
										className='bg-main hover:bg-main/90 text-white px-4 py-2 rounded-[20px] transition-colors text-sm font-medium'
									>
										{t('birthControl.next_month')}
									</button>
								</div>
							</div>

							{/* Calendar */}
							<Calendar year={year} month={month} cycle={birthControl} />
						</div>
					</motion.div>
				</div>
			) : (
				<div className='text-center max-w-md mx-auto p-6'>
					<div className='text-gray-400 text-4xl mb-4'>👤</div>
					<h3 className='text-xl font-semibold text-gray-800 mb-2'>
						{t('birthControl.account_required')}
					</h3>
					<p className='text-gray-600'>
						{t('birthControl.please_login_to_access')}
					</p>
				</div>
			)}

			{/* Information Section */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.3 }}
				className='bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-[30px] border border-blue-200'
			>
				<h2 className='text-xl font-bold text-main mb-4'>
					{t('birthControl.tracking_method_info')}
				</h2>
				<div className='grid md:grid-cols-2 gap-6 text-sm text-gray-700'>
					<div className='space-y-3'>
						<h3 className='font-semibold text-gray-800'>
							{t('birthControl.how_it_works')}
						</h3>
						<ul className='space-y-2 list-disc list-inside'>
							<li>{t('birthControl.track_menstrual_start')}</li>
							<li>{t('birthControl.calculate_safe_unsafe')}</li>
							<li>{t('birthControl.predict_ovulation')}</li>
							<li>{t('birthControl.provide_planning_info')}</li>
						</ul>
					</div>
					<div className='space-y-3'>
						<h3 className='font-semibold text-gray-800'>
							{t('birthControl.important_notes')}
						</h3>
						<ul className='space-y-2 list-disc list-inside'>
							<li>{t('birthControl.reference_only')}</li>
							<li>{t('birthControl.not_100_effective')}</li>
							<li>{t('birthControl.combine_with_other_methods')}</li>
							<li>{t('birthControl.consult_doctor')}</li>
						</ul>
					</div>
				</div>
			</motion.div>
		</div>
	)
}

export default Page
