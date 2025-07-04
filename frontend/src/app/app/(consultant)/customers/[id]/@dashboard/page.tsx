'use client'

import React, { useState } from 'react'
import ConfirmationModal from '@/Components/Common/ConfirmationModal'

const CustomerAction = () => {
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const handleEdit = () => {
		alert('Edit clicked')
	}

	const handleDelete = () => {
		setIsDeleteModalOpen(true)
	}

	const confirmDelete = () => {
		alert('Deleted!')
		setIsDeleteModalOpen(false)
	}

	const handleMessage = () => {
		alert('Message sent')
	}

	return (
		<>
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

			<ConfirmationModal
				isOpen={isDeleteModalOpen}
				onClose={() => setIsDeleteModalOpen(false)}
				onConfirm={confirmDelete}
				title='Delete Customer'
				message='Are you sure you want to delete this customer? This action cannot be undone.'
				confirmText='Delete'
				cancelText='Cancel'
				isDangerous={true}
			/>
		</>
	)
}

export default CustomerAction
