import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { useSearchParams } from 'next/navigation'

const resetPasswordSchema = z
	.object({
		password: z
			.string()
			.min(8)
			.max(32)
			.regex(
				/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/,
				'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one number'
			),
		confirmPassword: z.string(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export default function ResetPasswordPage() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const email = searchParams.get('email')
	const token = searchParams.get('token')

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(resetPasswordSchema),
	})

	const onSubmit = async data => {
		try {
			const response = await fetch('/api/auth/reset-password', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					...data,
					email,
					token,
				}),
			})

			if (response.ok) {
				router.push('/login')
			} else {
				alert('Something went wrong')
			}
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)}>
			<label>
				Password
				<input type='password' {...register('password')} />
				{errors.password && <p>{errors.password.message}</p>}
			</label>

			<label>
				Confirm Password
				<input type='password' {...register('confirmPassword')} />
				{errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
			</label>

			<input type='submit' value='Reset Password' />
		</form>
	)
}
