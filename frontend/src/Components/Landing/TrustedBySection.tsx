'use client'

import { CheckCircle, Clock, DollarSign, Star, Zap } from 'lucide-react'
import { useLocale } from '@/Hooks/useLocale'

export default function TrustedBySection() {
	const { t } = useLocale()
	const items = [
		{
			title: t('landing.trusted.support247.title'),
			desc: t('landing.trusted.support247.desc'),
			icon: <Clock className='w-6 h-6' />,
		},
		{
			title: (
				<span className='inline-flex items-center gap-1'>
					{t('landing.trusted.rating.title')}
					<Star className='w-5 h-5 text-yellow-500 fill-yellow-500' />
				</span>
			),
			desc: t('landing.trusted.rating.desc'),
			icon: <Star className='w-6 h-6' />,
		},
		{
			title: t('landing.trusted.doctors.title'),
			desc: t('landing.trusted.doctors.desc'),
			icon: <CheckCircle className='w-6 h-6' />,
		},
		{
			title: t('landing.trusted.booking.title'),
			desc: t('landing.trusted.booking.desc'),
			icon: <Zap className='w-6 h-6' />,
		},
		{
			title: t('landing.trusted.flexible.title'),
			desc: t('landing.trusted.flexible.desc'),
			icon: <DollarSign className='w-6 h-6' />,
		},
	]

	return (
		<section className='bg-white text-center px-8 pt-6 rounded-[30px] mx-auto max-w-6xl mt-0 z-20 shadow-2xl border border-gray-100/50'>
			<div className='flex flex-row justify-between items-stretch gap-6 px-4 text-center'>
				{items.map((item, i) => (
					<div
						key={i}
						className='flex-1 px-4 py-6 transition-all duration-200 hover:bg-gray-50 rounded-2xl flex flex-col items-center cursor-pointer group'
					>
						<div className='w-12 h-12 mb-3 bg-accent rounded-2xl flex items-center justify-center text-white shadow-lg transition-all duration-200 group-hover:scale-110 group-hover:shadow-xl'>
							{item.icon}
						</div>
						<h3 className='text-xl font-bold text-main mb-2'>{item.title}</h3>
						<p className='text-sm text-secondary leading-relaxed'>
							{item.desc}
						</p>
					</div>
				))}
			</div>
		</section>
	)
}
