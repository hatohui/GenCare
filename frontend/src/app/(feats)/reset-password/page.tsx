'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useMutation } from '@tanstack/react-query'
import { DEFAULT_API_URL } from '@/Constants/API'
import { ResetPasswordRequest } from '@/Interfaces/Auth/Schema/forgot-password'

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(32, 'Password must be at most 32 characters')
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
				'Password must contain at least one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams?.get('email') ?? ''
	const token = searchParams?.get('token') ?? ''
	const [retryTimer, setRetryTimer] = useState<number | null>(null)
	const [intervalRef, setIntervalRef] = useState<NodeJS.Timeout | null>(null)

	React.useEffect(() => {
		if (!email || !token) {
			router.push('/forgot-password')
		}
	}, [email, token, router])

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
	} = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
	})

	const { mutate, isPending } = useMutation({
		mutationKey: ['reset-password'],
		mutationFn: async (data: ResetPasswordRequest) =>
			axios.post(`${DEFAULT_API_URL}/auth/reset-password`, data),
		onSuccess: () => {
			startRetryTimer()
		},
		onError: (error: any) => {
			window.alert(error?.response?.data?.message || 'Something went wrong')
		},
	})

	const startRetryTimer = () => {
		setRetryTimer(10)
		const interval = setInterval(() => {
			setRetryTimer(prev => {
				if (prev !== null) {
					if (prev <= 1) {
						clearInterval(interval)
						setIntervalRef(null)
						setRetryTimer(null)
						router.push('/login')
					}
					return prev - 1
				}
				return null
			})
		}, 1000)
		setIntervalRef(interval)
	}

	const onSubmit = (data: ResetPasswordFormData) => {
		mutate({
			email,
			newPassword: data.password,
			resetPasswordToken: token,
		})
	}

	return (
		<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4 relative'>
			<div className='absolute top-0 left-0 full-screen florageBackground' />
			<div className='w-full max-w-md space-y-6 bg-white p-8 rounded-lg shadow-lg relative z-10'>
				<h1 className='text-center text-3xl font-bold tracking-tight text-slate-950'>
					Reset Your Password
				</h1>
				<form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
					<div className='space-y-2'>
						<label
							htmlFor='password'
							className='block text-sm font-medium text-slate-950'
						>
							Password
						</label>
						<input
							id='password'
							type='password'
							className='relative block w-full px-3 py-2 text-slate-950 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-main focus:border-main sm:text-sm'
							{...register('password')}
						/>
						{errors.password && (
							<p className='text-sm text-accent'>{errors.password.message}</p>
						)}
					</div>

					<div className='space-y-2'>
						<label
							htmlFor='confirmPassword'
							className='block text-sm font-medium text-slate-950'
						>
							Confirm Password
						</label>
						<input
							id='confirmPassword'
							type='password'
							className='relative block w-full px-3 py-2 text-slate-950 border border-gray-300 rounded-md appearance-none focus:outline-none focus:ring-main focus:border-main sm:text-sm'
							{...register('confirmPassword')}
						/>
						{errors.confirmPassword && (
							<p className='text-sm text-accent'>
								{errors.confirmPassword.message}
							</p>
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
								Resetting...
							</span>
						) : retryTimer !== null ? (
							`Retry in ${retryTimer}s`
						) : (
							'Reset Password'
						)}
					</button>
				</form>
				{retryTimer !== null && (
					<p className='text-sm text-green-600 text-center'>
						Password reset successful. You will be redirected to login shortly.
					</p>
				)}
			</div>
		</div>
	)
}
