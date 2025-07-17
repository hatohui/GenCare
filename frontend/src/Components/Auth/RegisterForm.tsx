'use client'

import { useState } from 'react'
import z4 from 'zod/v4'
import {
	RegisterFormData,
	RegisterFormSchema,
} from '@/Interfaces/Auth/Schema/register'
import FloatingLabel, { FloatingLabelErrorData } from '../Form/FloatingLabel'
import GoogleLoginButton from './GoogleLoginButton'
import SubmitButton from './SubmitButton'
import clsx from 'clsx'
import { OauthResponse } from '@/Interfaces/Auth/Schema/oauth'
import { useLocale } from '@/Hooks/useLocale'

type RegisterFormProps = keyof RegisterFormData

export type RegisterComponentProps = {
	handleRegister: (data: RegisterFormData) => void
	className?: string
	handleLogin: (response: OauthResponse) => void
}

const RegisterForm = ({
	handleRegister,
	className,
	handleLogin,
}: RegisterComponentProps) => {
	const { t } = useLocale()
	const [form, setForm] = useState<RegisterFormData>({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		email: '',
		gender: false,
		phoneNumber: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
	})

	const [errors, setErrors] = useState<Record<string, FloatingLabelErrorData>>(
		{}
	)

	const [step, setStep] = useState(1) // Step state to toggle between sections

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target
		const isChecked = (e.target as HTMLInputElement).checked

		const updatedForm = {
			...form,
			[name]:
				type === 'checkbox'
					? isChecked
					: name === 'gender'
					? value === 'true' // Convert string 'true'/'false' to boolean
					: value,
		}

		setForm(updatedForm)
		validateForm(name as RegisterFormProps, updatedForm)
	}

	const validateForm = (
		name: RegisterFormProps,
		currentForm: RegisterFormData
	) => {
		const result = RegisterFormSchema.safeParse(currentForm)

		if (!result.success) {
			const filteredErrors: Record<string, FloatingLabelErrorData> = {}
			const properties = z4.treeifyError(result.error).properties

			if (properties && properties[name]) {
				filteredErrors[name] = properties[name]
			}

			setErrors(filteredErrors)
		} else {
			setErrors({})
		}
	}

	const validateEntireForm = (formData: RegisterFormData): boolean => {
		const result = RegisterFormSchema.safeParse(formData)

		if (!result.success) {
			const filteredErrors: Record<string, FloatingLabelErrorData> = {}
			const properties = z4.treeifyError(result.error).properties

			if (properties) {
				;(Object.keys(properties) as Array<keyof RegisterFormData>).forEach(
					field => {
						filteredErrors[field] = properties[field]!
					}
				)
			}

			setErrors(filteredErrors)
			return false
		}
		setErrors({})
		return true
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const isValid = validateEntireForm(form)

		if (isValid) {
			try {
				handleRegister(form)
			} catch (error) {
				console.log(error)

				alert('error!')
				//! HANDLE SERVICE ERROR
			}
		}
	}

	// Switch between steps (1 and 2)
	const handleNext = () => {
		setStep(2)
	}

	const handleBack = () => {
		setStep(1)
	}

	return (
		<form
			className={clsx(
				'p-7 max-w-lg min-w-sm mx-auto rounded-3xl bg-general',
				className
			)}
			onSubmit={handleSubmit}
		>
			<h1 className='text-xl font-bold mb-4'>
				{step === 1
					? t('auth.register.titleStep1')
					: t('auth.register.titleStep2')}
			</h1>

			{/* Step 1: Basic Information */}
			{step === 1 && (
				<>
					<div className='flex gap-4'>
						<FloatingLabel
							label={t('common.lastName')}
							id='lastName'
							name='lastName'
							value={form.lastName}
							onChange={handleChange}
							error={errors.lastName}
						/>
						<FloatingLabel
							label={t('common.firstName')}
							id='firstName'
							name='firstName'
							value={form.firstName}
							onChange={handleChange}
							error={errors.firstName}
						/>
					</div>

					<FloatingLabel
						label={t('common.email')}
						id='email'
						name='email'
						value={form.email}
						onChange={handleChange}
						error={errors.email}
					/>

					<FloatingLabel
						label={t('common.password')}
						id='password'
						type='password'
						name='password'
						value={form.password}
						onChange={handleChange}
						error={errors.password}
					/>

					<FloatingLabel
						label={t('common.confirmPassword')}
						id='confirmPassword'
						type='password'
						name='confirmPassword'
						value={form.confirmPassword}
						onChange={handleChange}
						error={errors.confirmPassword}
					/>

					<FloatingLabel
						label={t('common.phoneNumber')}
						id='phoneNumber'
						name='phoneNumber'
						value={form.phoneNumber}
						onChange={handleChange}
						error={errors.phoneNumber}
					/>

					{/* Next button */}
					<div className='mt-4'>
						<button
							type='button'
							onClick={handleNext}
							className='w-full p-2 rounded-full bg-main text-white'
						>
							{t('auth.register.nextStep')}
						</button>
					</div>
				</>
			)}

			{/* Step 2: Additional Information */}
			{step === 2 && (
				<>
					{/* Ngày sinh (Date of Birth) */}
					<div className='mb-4'>
						<label
							htmlFor='dateOfBirth'
							className={`block text-sm font-medium mb-1 ${
								errors.dateOfBirth ? 'text-red-500' : 'text-gray-700'
							}`}
						>
							{t('common.dateOfBirth')}
						</label>
						<input
							type='date'
							id='dateOfBirth'
							name='dateOfBirth'
							value={form.dateOfBirth}
							onChange={handleChange}
							className={`w-full px-3 py-2 border ${
								errors.dateOfBirth
									? 'border-red-500 focus:ring-red-500 focus:border-red-500'
									: 'border-gray-300 focus:ring-main focus:border-main'
							} rounded-md shadow-sm focus:outline-none focus:ring-0`}
						/>
						{errors.dateOfBirth && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.dateOfBirth.errors[0]}
							</p>
						)}
					</div>
					<div className='mb-4'>
						<label
							htmlFor='gender'
							className='block text-sm font-medium text-gray-700 mb-1'
						>
							{t('common.gender')}
						</label>
						<select
							id='gender'
							name='gender'
							value={`${form.gender}`}
							onChange={handleChange}
							className={`w-full px-3 py-2 border ${
								errors.gender ? 'border-red-500' : 'border-gray-300'
							} rounded-md shadow-sm focus:ring-main focus:border-main focus:outline-none focus:ring-0`}
						>
							<option value='true'>{t('common.male')}</option>
							<option value='false'>{t('common.female')}</option>
						</select>
						{errors.gender && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.gender.errors[0]}
							</p>
						)}
					</div>

					{/* Đồng ý điều khoản (Agree to terms) */}
					<div className='mb-4 mt-2'>
						<label className={`flex items-center gap-2 text-gray-700`}>
							<input
								type='checkbox'
								name='agreeToTerms'
								checked={form.agreeToTerms}
								onChange={handleChange}
								className={`w-4 h-4`}
							/>
							<span>{t('auth.register.agreeToTerms')}</span>
						</label>
						{errors.agreeToTerms && (
							<p className='text-red-500 text-sm mt-1'>
								{errors.agreeToTerms.errors[0]}
							</p>
						)}
					</div>

					{/* Submit button */}
					<SubmitButton
						label={t('auth.register.submit')}
						buttonClass='bg-main text-white w-full p-2 rounded-full flex justify-center bg-gradient-to-r from-accent to-accent/80 backdrop-blur-3xl hover:from-accent/90 hover:to-accent'
					/>

					{/* Back button */}
					<div className='mt-4'>
						<button
							type='button'
							onClick={handleBack}
							className='w-full p-2 rounded-full bg-gray-500 text-white'
						>
							{t('auth.register.backStep')}
						</button>
					</div>
				</>
			)}

			{/* Footer: Google Login & Redirect */}
			<div className='text-center text-gray-500 mt-4'>
				{t('auth.alreadyHaveAccount')}{' '}
				<a href='/login' className='text-accent hover:underline'>
					{t('auth.login')}
				</a>
			</div>

			<div className='text-center text-gray-500'>
				<GoogleLoginButton
					text='signup_with'
					className='mt-4 h-10 mx-auto'
					handleLogin={handleLogin}
				/>
			</div>
		</form>
	)
}

export default RegisterForm
