import React from 'react'

const Page = () => {
	return (
		<main className='py-30 space-y-10'>
			<section className='bg-white h-100 w-5/6 mx-auto py-4 rounded-[30px] shadow-xl'></section>
			<section className='bg-white h-20 w-5/6 mx-auto py-4 rounded-[30px] shadow-xl'></section>
			<section className=' flex items-center justify-around gap-10 w-5/6 mx-auto h-[50vh]'>
				<div className='bg-white h-full w-1/3 py-4 rounded-[30px] bg-gradient-to-br from-main/20 to-secondary/20'></div>

				<div className='bg-white h-full w-full py-4 rounded-[30px]'></div>
			</section>
		</main>
	)
}

export default Page
