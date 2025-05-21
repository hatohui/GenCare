'use client'

import RegisterPage from '@/Components/Auth/RegisterForm'
import { NavBar } from '@/Components/NavBar/NavBar'

const Page = () => {
	return (
		<div className=' h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center flex-col py-[50px]'>
			<NavBar />
			<RegisterPage />
			<RegisterPage />
			<RegisterPage />
		</div>
	)
}

export default Page
