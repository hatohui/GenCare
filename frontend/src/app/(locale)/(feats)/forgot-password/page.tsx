'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { DEFAULT_API_URL } from '@/Constants/API'
import LanguageSwitcher from '@/Components/LanguageSwitcher'
import { useLocale } from '@/Hooks/useLocale'
import {
	ForgotPasswordRequest,
	forgotPasswordSchema,
} from '@/Interfaces/Auth/Schema/forgot-password'
import Link from 'next/link'

export default function ForgotPasswordPage() {
	const [retryTimer, setRetryTimer] = useState<number | null>(null)
	const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null)
	const { t } = useLocale()

	React.useEffect(() => {
		return () => {
			if (intervalRef) {
				clearInterval(intervalRef)
			}
		}
	}, [intervalRef])

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<ForgotPasswordRequest>({
		resolver: zodResolver(forgotPasswordSchema),
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['forgot-password'],
		mutationFn: async (data: ForgotPasswordRequest) =>
			axios.post(`${DEFAULT_API_URL}/api/auth/forgot-password`, data),
		onSuccess: () => {
			// Do not reset the form to preserve the email input
			startRetryTimer()
		},
		onError: (error: any) => {
			window.alert(
				error?.response?.data?.message || t('common.error.try_again_later')
			)
		},
	})

	const startRetryTimer = () => {
		setRetryTimer(10) // 10 seconds timer
		const interval = setInterval(() => {
			setRetryTimer(prev => {
				if (prev !== null) {
					if (prev <= 1) {
						clearInterval(interval)
						setIntervalRef(null)
						setRetryTimer(null)
					}
					return prev - 1
				}
				return null
			})
		}, 1000)
		setIntervalRef(interval)
	}

	const onSubmit = (data: ForgotPasswordRequest) => {
		mutate(data)
	}

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 relative'>
			<div className='absolute top-0 left-0 full-screen florageBackground' />

			{/* Language Switcher */}
			<div className='absolute top-4 right-4 z-20'>
				<LanguageSwitcher onTop={true} />
			</div>

			<div className='w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg relative z-10'>
				<h2 className='text-center text-3xl font-bold tracking-tight text-slate-950'>
					{t('auth.forgotPassword')}
				</h2>
				<p className='text-center text-sm text-gray-600'>
					{t('auth.forgotPasswordDescription')}
				</p>
				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					<div className='space-y-2'>
						<label htmlFor='email-address' className='sr-only'>
							{t('form.email')}
						</label>
						<input
							{...register('email')}
							id='email-address'
							name='email'
							type='email'
							autoComplete='email'
							required
							className='relative block w-full px-3 py-2 text-slate-950 placeholder-gray-500 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-main focus:border-main sm:text-sm'
							placeholder={t('form.email')}
						/>
						{errors.email && (
							<p className='text-sm text-accent'>{errors.email.message}</p>
						)}
					</div>

					<button
						type='submit'
						disabled={isPending || retryTimer !== null}
						className='group relative flex w-full justify-center rounded-md border border-transparent bg-accent py-2 px-4 text-sm font-medium text-white hover:brightness-90 transition duration-150 focus:outline-none focus:ring-2 focus:ring-main focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed'
					>
						{isPending ? (
							<span className='flex items-center'>
								<svg
									className='animate-spin -ml-1 mr-3 h-5 w-5 text-white'
									xmlns='http://www.w3.org/2000/svg'
									fill='none'
									viewBox='0 0 24 24'
								>
									<circle
										className='opacity-25'
										cx='12'
										cy='12'
										r='10'
										stroke='currentColor'
										strokeWidth='4'
									></circle>
									<path
										className='opacity-75'
										fill='currentColor'
										d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
									></path>
								</svg>
								{t('common.loading')}
							</span>
						) : retryTimer !== null ? (
							`${t('common.retry')} ${retryTimer}s`
						) : (
							t('auth.sendResetEmail')
						)}
					</button>
				</form>
				{retryTimer !== null && (
					<p className='text-sm text-green-600 text-center'>
						{t('auth.resetEmailSent')}
					</p>
				)}
				<div className='text-center'>
					<Link
						href='/login'
						className='text-sm text-accent hover:text-accent/80 transition-colors duration-200'
					>
						{t('auth.backToLogin')}
					</Link>
				</div>
			</div>
		</div>
	)
}
