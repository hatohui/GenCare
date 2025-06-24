'use client'

import React from 'react'

const CustomerAction = () => {
	const handleEdit = () => {
		alert('Edit clicked')
	}

	const handleDelete = () => {
		const confirmed = confirm('Are you sure you want to delete this customer?')
		if (confirmed) {
			alert('Deleted!')
		}
	}

	const handleMessage = () => {
		alert('Message sent')
	}

	return (
		<div className='mt-6 flex gap-3 flex-wrap'>
			<button
				onClick={handleEdit}
				className='bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition'
			>
				Edit Customer
			</button>

			<button
				onClick={handleDelete}
				className='bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition'
			>
				Delete
			</button>

			<button
				onClick={handleMessage}
				className='bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition'
			>
				Send Message
			</button>
		</div>
	)
}

export default CustomerAction
