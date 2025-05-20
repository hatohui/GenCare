'use client'

import RegisterPage from '@/Components/Auth/RegisterForm'
import { NavBar } from '@/Components/NavBar/NavBar'

const Page = () => {
	return (
		<div className=' h-screen  bg-amber-100'>
			<NavBar />
			<RegisterPage />
			<RegisterPage />
			<RegisterPage />
		</div>
	)
}

export default Page
