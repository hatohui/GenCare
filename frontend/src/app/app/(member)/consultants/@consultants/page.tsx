'use client'
import React from 'react'

const ConsultantList = () => {
	const staffs = [
		{
			accountId: '1',
			name: 'Dr. Nguyen Van A',
			specialization: 'General Practitioner',
			rating: 4.8,
			biography:
				'10+ years of experience providing comprehensive primary care.',
		},
		{
			accountId: '2',
			name: 'Prof. Tran Thi B',
			specialization: 'Mental Health Specialist',
			rating: 4.9,
			biography: 'Focused on mental wellness and emotional health counseling.',
		},
		{
			accountId: '3',
			name: 'Dr. Le Van C',
			specialization: 'Dermatologist',
			rating: 4.7,
			biography:
				'Expert in skin care, dermatological treatment, and cosmetic consultation.',
		},
	]

	return (
		<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6'>
			{staffs.map(staff => (
				<div
					key={staff.accountId}
					className='bg-white border border-blue-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300'
				>
					<div className='p-6 h-full w-full'>
						<div className='flex flex-col items-center text-center'>
							<img
								src={`https://randomuser.me/api/portraits/med/${
									+staff.accountId % 2 === 0 ? 'women' : 'men'
								}/${staff.accountId}.jpg`}
								alt='consultant'
								className='w-24 h-24 rounded-full object-cover border-4 border-blue-200 mb-4'
							/>
							<h2 className='text-lg font-semibold text-blue-900'>
								{staff.name}
							</h2>
							<span className='text-xs text-white bg-gradient-to-l from-main to-secondary px-3 py-1 rounded-full mt-1'>
								{staff.specialization}
							</span>
							<p className='text-sm text-gray-600 mt-3 h-16 max-h-16 truncate text-wrap'>
								{staff.biography}
							</p>
						</div>

						<div className='flex items-center justify-between mt-6'>
							<span className='text-sm text-yellow-500 font-medium'>
								⭐ {staff.rating.toFixed(1)} / 5
							</span>
							<button className='bg-accent text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 transition'>
								<span className='hidden xl:block'>Book Consultation</span>
								<span className='block xl:hidden'>Book</span>
							</button>
						</div>
					</div>
				</div>
			))}

			{/* Placeholder Card */}
			<div className='bg-white border-2 border-dashed border-blue-200 rounded-2xl shadow-inner flex flex-col items-center justify-center p-6 text-center'>
				<div className='w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-400 text-3xl font-bold mb-4'>
					+
				</div>
				<h2 className='text-lg font-semibold text-blue-500'>
					New Consultant Coming Soon
				</h2>
				<p className='text-sm text-gray-500 mt-2'>
					We’re expanding our team of healthcare professionals. Stay tuned!
				</p>
			</div>
		</div>
	)
}

export default ConsultantList
