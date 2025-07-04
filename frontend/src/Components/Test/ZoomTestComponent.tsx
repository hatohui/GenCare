'use client'

import React from 'react'
import { useCreateAppointmentWithZoom } from '@/Services/appointment-service'
import { toast } from 'react-hot-toast'

const ZoomTestComponent = () => {
	const createAppointmentMutation = useCreateAppointmentWithZoom()

	const handleTestZoomIntegration = async () => {
		try {
			// Test data - replace with actual IDs from your system
			const testData = {
				memberId: 'test-member-id', // Replace with actual member ID
				staffId: 'test-staff-id', // Replace with actual staff ID
				scheduleAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
			}

			const result = await createAppointmentMutation.mutateAsync(testData)

			toast.success(
				<>
					Zoom integration test successful!
					<br />
					Meeting ID: {result.zoomMeeting.meetingId}
					<br />
					<a
						href={result.zoomMeeting.joinUrl}
						target='_blank'
						rel='noopener noreferrer'
						className='underline text-blue-600'
					>
						Test Zoom Meeting Link
					</a>
				</>
			)

			console.log('Zoom integration test result:', result)
		} catch (error: any) {
			toast.error(
				`Zoom integration test failed: ${error?.message || 'Unknown error'}`
			)
			console.error('Zoom integration test error:', error)
		}
	}

	return (
		<div className='p-6 bg-white rounded-lg shadow-md'>
			<h3 className='text-lg font-semibold mb-4'>Zoom Integration Test</h3>
			<p className='text-sm text-gray-600 mb-4'>
				This component tests the Zoom API integration. Make sure to replace the
				test IDs with actual member and staff IDs from your system.
			</p>
			<button
				onClick={handleTestZoomIntegration}
				disabled={createAppointmentMutation.isPending}
				className='px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed'
			>
				{createAppointmentMutation.isPending
					? 'Testing...'
					: 'Test Zoom Integration'}
			</button>
			{createAppointmentMutation.isError && (
				<div className='mt-4 p-3 bg-red-50 border border-red-200 rounded'>
					<p className='text-sm text-red-600'>
						Error:{' '}
						{createAppointmentMutation.error instanceof Error
							? createAppointmentMutation.error.message
							: 'Unknown error'}
					</p>
				</div>
			)}
		</div>
	)
}

export default ZoomTestComponent
