'use client'

import { useRef, useState } from 'react'
import z4 from 'zod/v4'
import { useFormStatus } from 'react-dom'
import {
	RegisterFormData,
	RegisterFormSchema,
} from '@/Interfaces/Auth/Schema/register'
import { motion } from 'motion/react'
import FloatingLabel, { FloatingLabelErrorData } from '../Form/FloatingLabel'
import { Gender } from '@/Enums/Gender'

type RegisterFormProps = keyof RegisterFormData

export type RegisterComponentProps = {
	handleRegister: (data: RegisterFormData) => void
}

const RegisterForm = ({ handleRegister }: RegisterComponentProps) => {
	const [form, setForm] = useState<RegisterFormData>({
		firstName: '',
		lastName: '',
		dateOfBirth: '2000-01-01',
		email: '',
		gender: Gender.Male,
		phoneNumber: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
	})

	const [errors, setErrors] = useState<Record<string, FloatingLabelErrorData>>(
		{}
	)
	const checked = useRef(new Set<RegisterFormProps>())

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked: isChecked } = e.target

		const updatedForm = {
			...form,
			[name]: type === 'checkbox' ? isChecked : value,
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

			checked.current.add(name)

			checked.current.forEach(field => {
				if (properties && properties[field]) {
					filteredErrors[field] = properties[field]
				}
			})

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
				await handleRegister(form)
				alert('success!')
				//! HANDLE REGISTERING DATA
			} catch (error) {
				console.log(error)

				alert('error!')
				//! HANDLE SERVICE ERROR
			}
		}
	}

	return (
		<form
			className='p-7 max-w-lg min-w-md mx-auto rounded-3xl bg-general'
			onSubmit={handleSubmit}
		>
			<h1 className='text-xl font-bold mb-4'>Đăng ký tài khoản</h1>

			<div className='flex gap-4 mb-4'>
				<FloatingLabel
					label='Họ'
					id='lastName'
					name='lastName'
					value={form.lastName}
					onChange={handleChange}
					error={errors.lastName}
				/>
				<FloatingLabel
					label='Tên'
					id='firstName'
					name='firstName'
					value={form.firstName}
					onChange={handleChange}
					error={errors.firstName}
				/>
			</div>

			<FloatingLabel
				label='Email'
				id='email'
				name='email'
				value={form.email}
				onChange={handleChange}
				error={errors.email}
			/>

			<FloatingLabel
				label='Mật khẩu'
				id='password'
				type='password'
				name='password'
				value={form.password}
				onChange={handleChange}
				error={errors.password}
			/>

			<FloatingLabel
				label='Xác nhận mật khẩu'
				id='confirmPassword'
				type='password'
				name='confirmPassword'
				value={form.confirmPassword}
				onChange={handleChange}
				error={errors.confirmPassword}
			/>

			<FloatingLabel
				label='Ngày sinh (dd/mm/yyyy)'
				id='dateOfBirth'
				type='date'
				name='dateOfBirth'
				value={form.dateOfBirth}
				onChange={handleChange}
				error={errors.dateOfBirth}
			/>

			{/* <div>
				<input
					id='agree'
					type='checkbox'
					name='agreeToTerms'
					onChange={handleChange}
				/>
				<label htmlFor='agree'>Tôi đồng ý với điều khoản dịch vụ</label>
			</div>
			{errors.agreeToTerms && (
				<p className='text-red-500 text-sm'>{errors.agreeToTerms?.errors}</p>
			)} */}
			<SubmitButton buttonClass='bg-main text-white p-2 rounded-full flex justify-center bg-gradient-to-r from-accent to-accent/80 backdrop-blur-3xl hover:from-accent/90 hover:to-accent	 ' />
		</form>
	)
}

export const SubmitButton = ({ buttonClass }: { buttonClass: string }) => {
	const { pending } = useFormStatus()

	return (
		<motion.button
			type='submit'
			className={buttonClass}
			disabled={pending}
			animate={{ scale: pending ? 0.95 : 1 }}
			transition={{ duration: 0.2, ease: 'easeInOut' }}
			whileHover={{ scale: 1.05 }}
			whileTap={{ scale: 0.95 }}
		>
			Submit
		</motion.button>
	)
}

export default RegisterForm
