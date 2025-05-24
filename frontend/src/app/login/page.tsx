import LoginForm from '@/Components/Auth/LoginForm'
import Link from 'next/link'

export default function Login() {
	return (
		<>
			<div className='full-screen center-all bg-gradient-to-b from-main to-secondary p-4'>
				<LoginForm />
			</div>
		</>
	)
}
