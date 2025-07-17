import type { NextApiRequest, NextApiResponse } from 'next'
import { DEFAULT_API_URL } from '@/Constants/API'

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' })
	}

	try {
		const { memberId, staffId, scheduleAt } = req.body

		// Validate required fields
		if (!memberId || !staffId || !scheduleAt) {
			return res.status(400).json({
				error: 'Missing required fields: memberId, staffId, scheduleAt',
			})
		}

		// Get authorization header from the request
		const authHeader = req.headers.authorization
		if (!authHeader) {
			return res.status(401).json({ error: 'Authorization header is required' })
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
			return res.status(response.status).json({
				error: errorData.message || 'Failed to create appointment',
			})
		}

		const data = await response.json()
		return res.status(200).json(data)
	} catch (error) {
		console.error('Error creating appointment with Zoom:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
