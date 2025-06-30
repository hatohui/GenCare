'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const forgotPasswordSchema = z.object({
	email: z.string().email('Invalid email address').min(1, 'Email is required'),
})

const ForgotPasswordPage = () => {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(forgotPasswordSchema),
	})

	const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
		setLoading(true)
		setLoading(false)
	}

	return (
		<div className='flex min-h-screen flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8'>
			<div className='w-full max-w-md space-y-8'>
				<div>
					<h2 className='mt-6 text-center text-3xl font-bold tracking-tight text-gray-900'>
						Forgot Password
					</h2>
				</div>
				<form className='mt-8 space-y-6' onSubmit={handleSubmit(onSubmit)}>
					<input type='hidden' name='remember' value='true' />
					<div className='-space-y-px rounded-md shadow-sm'>
						<div>
							<label htmlFor='email-address' className='sr-only'>
								Email address
							</label>
							<input
								{...register('email', { required: true })}
								id='email-address'
								name='email'
								type='email'
								autoComplete='email'
								required
								className='relative block w-full px-3 py-2 text-gray-900 placeholder-gray-500 border border-gray-300 rounded-none appearance-none rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm'
								placeholder='Email address'
							/>
							{errors.email && (
								<p className='mt-2 text-sm text-red-600'>
									{errors.email.message}
								</p>
							)}
						</div>
					</div>

					<div>
						<button
							type='submit'
							className='group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
							disabled={loading}
						>
							{loading ? 'Loading...' : 'Send Reset Email'}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default ForgotPasswordPage
