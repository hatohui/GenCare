'use client'

import Profile from '@/Components/Profile/profile'
import { useAccountStore } from '@/Hooks/useAccount'
import { useLocale } from '@/Hooks/useLocale'
import React from 'react'

const Page = () => {
	const { data, isLoading } = useAccountStore()
	const { t } = useLocale()

	if (isLoading) {
		return <div>{t('common.loading')}</div>
	}

	if (!data) {
		return <div>{t('profile.no_account_data')}</div>
	}
	console.log(data)

	return (
		<div className='mx-auto'>
			<Profile data={data} />
		</div>
	)
}

export default Page
