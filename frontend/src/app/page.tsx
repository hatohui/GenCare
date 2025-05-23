'use client'
import { NavBar } from '@/Components/NavBar/NavBar'

const Page = () => {
	return (
		<>
			<NavBar />
			<div className='h-screen' />
			<div className='h-screen' />
			<div className='h-screen' />
			<div className='h-screen' />
			<div className='fixed top-0 left-0 w-screen h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center flex-col py-[50px]' />
		</>
	)
}

export default Page
