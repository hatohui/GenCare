'use client'

import { useState } from 'react'
import { registerUser } from '@/Services/auth-service'
import { ZodError } from 'zod'
import { useFormStatus } from 'react-dom'
import { motion } from 'motion/react'
import {
	RegisterFormData,
	RegisterSchema,
} from '@/Interfaces/Auth/Schema/register'

export default function RegisterPage() {
	const [form, setForm] = useState<RegisterFormData>({
		firstName: '',
		lastName: '',
		dateOfBirth: '',
		email: '',
		address: '',
		password: '',
		confirmPassword: '',
		agreeToTerms: false,
		timestamp: new Date().toISOString(),
	})
	const [errors, setErrors] = useState<Record<string, string>>({})

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value, type, checked } = e.target
		setForm(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value,
		}))
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		try {
			const parsed = RegisterSchema.parse(form)
			await registerUser(parsed)
			alert('Registered!')
		} catch (err) {
			console.log(err)

			if (err instanceof ZodError) {
				const fieldErrors: Record<string, string> = {}
				err.errors.forEach(e => {
					if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message
				})
				setErrors(fieldErrors)
			} else {
				alert('Error occurred.')
			}
		}
	}

	return (
		<div className='p-4 max-w-md mx-auto '>
			<h1 className='text-xl font-bold mb-4'>Register with Form</h1>
			<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
				<input
					name='firstName'
					placeholder='First Name'
					onChange={handleChange}
				/>
				{errors.firstName && (
					<p className='text-red-500 text-sm'>{errors.firstName}</p>
				)}

				<input
					name='lastName'
					placeholder='Last Name'
					onChange={handleChange}
				/>
				{errors.lastName && (
					<p className='text-red-500 text-sm'>{errors.lastName}</p>
				)}

				<input
					type='date'
					name='dateOfBirth'
					placeholder='dd/mm/yyyy'
					onChange={handleChange}
				/>
				{errors.dateOfBirth && (
					<p className='text-red-500 text-sm'>{errors.dateOfBirth}</p>
				)}

				<input
					type='email'
					name='email'
					placeholder='Email'
					onChange={handleChange}
				/>
				{errors.email && <p className='text-red-500 text-sm'>{errors.email}</p>}

				<input name='address' placeholder='Address' onChange={handleChange} />
				{errors.address && (
					<p className='text-red-500 text-sm'>{errors.address}</p>
				)}

				<input
					type='password'
					name='password'
					placeholder='Password'
					onChange={handleChange}
				/>
				{errors.password && (
					<p className='text-red-500 text-sm'>{errors.password}</p>
				)}

				<input
					type='password'
					name='confirmPassword'
					placeholder='Confirm Password'
					onChange={handleChange}
				/>
				{errors.confirmPassword && (
					<p className='text-red-500 text-sm'>{errors.confirmPassword}</p>
				)}

				<div>
					<input
						id='agree'
						type='checkbox'
						name='agreeToTerms'
						onChange={handleChange}
					/>
					<label htmlFor='agree'>Iagree to the Terms and Services</label>
				</div>
				{errors.agreeToTerms && (
					<p className='text-red-500 text-sm'>{errors.agreeToTerms}</p>
				)}
				<SubmitButton buttonClass='bg-blue-500 text-white p-2 rounded' />
			</form>
		</div>
	)
}

//messing around with animte button
//button is disabled when is submitting
const SubmitButton = ({ buttonClass }: { buttonClass: string }) => {
	const { pending } = useFormStatus()

	const box = {
		width: '100%',
		height: 50,
		backgroundColor: '#9911ff',
		borderRadius: 5,
	}

	return (
		<motion.button
			disabled={pending}
			type='submit'
			content='Submit'
			className={buttonClass}
			whileHover={{ scale: 1.2 }}
			whileTap={{ scale: 0.9 }}
			style={box}
		/>
	)
}
