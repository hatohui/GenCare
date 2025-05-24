import LoginForm from '@/Components/Auth/LoginForm'
import Link from 'next/link'

export default function Login() {
	return (
		<>
			<div className='full-screen center-all bg-gradient-to-b from-[#f5f5f5] to-[#e0e0e0]'>
				<LoginForm />
			</div>
		</>
	)
}
