'use client'

import LandingPart from '@/Components/Landing/LandingPart'
// import Loading from '@/Components/Loading'
// import React, { useEffect, useState } from 'react'

const Page = () => {
	// const [isLoading, setIsLoading] = useState(true)

	// useEffect(() => {
	// 	setTimeout(() => setIsLoading(false), 2000)
	// }, [])

	return (
		// <>
		// 	{isLoading ? (
		// 		<Loading />
		// 	) : (
		<>
			<LandingPart />
			<div className='h-screen' />
			<div className='h-screen' />
		</>
		// 		)}
		// 	</>
	)
}

export default Page
