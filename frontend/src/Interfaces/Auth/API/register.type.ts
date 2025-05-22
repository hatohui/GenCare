import { z } from 'zod'
import { Account } from '../Types/Account'

export type RegisterFormData =
	| Pick<
			Account,
			'firstName' | 'lastName' | 'dateOfBirth' | 'email' | 'address'
	  > & {
			password: string
			confirmPassword: string
			agreeToTerms: boolean
			timestamp: Date | string
	  }

export const RegisterSchema = z
	.object({
		firstName: z.string().min(1, { message: 'First name is required' }),
		lastName: z.string().min(1, { message: 'Last name is required' }),
		dateOfBirth: z
			.string()
			.date()
			.min(1, { message: 'Date of birth is required' }),
		email: z.string().email({ message: 'Email is not valid' }),
		address: z.string().min(1, { message: 'Address is required' }),
		password: z
			.string()
			.min(6, { message: 'Password must be at least 6 characters long' }),
		confirmPassword: z.string(),
		agreeToTerms: z.literal(true, { message: 'You must agree to terms' }),
		timestamp: z.string().min(1, { message: 'Timestamp is required' }),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})
