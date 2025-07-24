import { NextRequest, NextResponse } from 'next/server'
import { DEFAULT_API_URL } from '@/Constants/API'

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const { memberId, staffId, scheduleAt } = body

		// Validate required fields
		if (!memberId || !staffId || !scheduleAt) {
			return NextResponse.json(
				{ error: 'Missing required fields: memberId, staffId, scheduleAt' },
				{ status: 400 }
			)
		}

		// Get authorization header from the request
		const authHeader = request.headers.get('authorization')
		if (!authHeader) {
			return NextResponse.json(
				{ error: 'Authorization header is required' },
				{ status: 401 }
			)
		}

		// Call the backend API to create appointment with Zoom
		const response = await fetch(`${DEFAULT_API_URL}/appointments/with-zoom`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: authHeader,
			},
			body: JSON.stringify({
				memberId,
				staffId,
				scheduleAt,
			}),
		})

		if (!response.ok) {
			const errorData = await response.json()
			return NextResponse.json(
				{ error: errorData.message || 'Failed to create appointment' },
				{ status: response.status }
			)
		}

		const data = await response.json()
		return NextResponse.json(data)
	} catch (error) {
		console.error('Error creating appointment with Zoom:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 }
		)
	}
}
