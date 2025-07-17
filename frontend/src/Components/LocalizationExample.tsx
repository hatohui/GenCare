'use client'

import React from 'react'
import { useLocale } from '@/Hooks/useLocale'
import LanguageSwitcher from '@/Components/LanguageSwitcher'

const LocalizationExample = () => {
	const { t } = useLocale()

	return (
		<div className='p-6 bg-white rounded-lg shadow-md'>
			<div className='flex justify-between items-center mb-6'>
				<h1 className='text-2xl font-bold'>{t('app.title')}</h1>
				<LanguageSwitcher />
			</div>

			<p className='mb-4'>{t('app.description')}</p>

			<div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-6'>
				<div className='p-4 border rounded-lg'>
					<h2 className='font-bold mb-2'>{t('services.list')}</h2>
					<p>{t('services.popular')}</p>
				</div>

				<div className='p-4 border rounded-lg'>
					<h2 className='font-bold mb-2'>{t('appointment.my_appointments')}</h2>
					<p>{t('date.just_now')}</p>
					<p>{t('date.minutes_ago', { '0': '5' })}</p>
				</div>
			</div>

			<button className='mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg'>
				{t('action.save')}
			</button>
		</div>
	)
}

export default LocalizationExample
