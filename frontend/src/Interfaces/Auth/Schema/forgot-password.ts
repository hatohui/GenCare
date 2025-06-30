import z from 'zod/v4'

export const forgotPasswordSchema = z.object({
	email: z.email('Invalid email address').min(1, 'Email is required'),
})

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>

export type ForgotPasswordResponse = {
	callbackUrl: string
}

export type ResetPasswordRequest = {
	resetPasswordToken: string
	email: string
	newPassword: string
}
