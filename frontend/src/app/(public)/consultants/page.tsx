'use client'

import { ConsultantList } from '@/Components/Consultant'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'

export default function ConsultantsPage() {
	const handleConsultantClick = (consultant: Consultant) => {
		// Handle consultant click - could navigate to detail page, open modal, etc.
		console.log('Consultant clicked:', consultant)
		// Example: router.push(`/consultants/${consultant.id}`)
	}

	return (
		<div className='container mx-auto px-4 py-8'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold text-gray-900 mb-2'>
					Our Consultants
				</h1>
				<p className='text-gray-600'>
					Meet our experienced healthcare professionals dedicated to providing
					you with the best care.
				</p>
			</div>

			<ConsultantList
				itemsPerPage={12}
				onConsultantClick={handleConsultantClick}
			/>
		</div>
	)
}
