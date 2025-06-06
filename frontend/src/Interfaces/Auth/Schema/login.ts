import z from 'zod/v4'

export type LoginApi = {
	email: string
	password: string
}

export const loginSchema = z.object({
	email: z.email('Invalid email address').min(1, 'Email is required'),
	password: z.string().min(6, 'Password must be at least 6 characters long'),
})
