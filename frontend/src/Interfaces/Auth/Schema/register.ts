import { z } from 'zod/v4'
import { Account } from '../Types/Account'

export type RegisterFormData =
	| Pick<Account, 'firstName' | 'lastName' | 'dateOfBirth' | 'email'> & {
			password: string
			confirmPassword: string
			agreeToTerms: boolean
	  }

export const RegisterFormSchema = z
	.object({
		firstName: z
			.string()
			.min(1, { message: 'Tên là mục bắt buộc.' })
			.regex(/^[\p{L}\s]+$/u, {
				message: 'Trong mục tên không được có kí tự đặc biệt',
			}),

		lastName: z
			.string()
			.min(1, { message: 'Họ là mục bắt buộc' })
			.regex(/^[\p{L}\s]+$/u, {
				message: 'Trong mục họ không được có kí tự đặc biệt',
			}),

		dateOfBirth: z
			.string()
			.date()
			.min(1, { message: 'Ngày sinh là mục bắt buộc' }),

		email: z.string().email({ message: 'Email không hợp lệ' }),

		password: z
			.string()
			.min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),

		confirmPassword: z.string(),

		agreeToTerms: z.boolean().refine(val => val === true, {
			message: 'Bạn phải đồng ý với điều khoản',
		}),
	})
	.refine(
		data =>
			data.password === data.confirmPassword &&
			data.confirmPassword.length !== 0,
		{
			message: 'Mật khẩu không khớp',
			path: ['confirmPassword'],
		}
	)
