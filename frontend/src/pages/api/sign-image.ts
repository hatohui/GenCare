import { v2 as cloudinary } from 'cloudinary'
import type { NextApiRequest, NextApiResponse } from 'next'

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
})

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	try {
		if (!process.env.CLOUDINARY_API_SECRET) {
			return res
				.status(500)
				.json({ error: 'Cloudinary API secret not configured' })
		}

		const { paramsToSign } = req.body
		if (!paramsToSign || typeof paramsToSign !== 'object') {
			return res.status(400).json({ error: 'Invalid paramsToSign provided' })
		}

		const signature = cloudinary.utils.api_sign_request(
			paramsToSign,
			process.env.CLOUDINARY_API_SECRET!
		)

		return res.status(200).json({ signature })
	} catch (error) {
		console.error('Error signing Cloudinary request:', error)
		return res.status(500).json({ error: 'Internal server error' })
	}
}
