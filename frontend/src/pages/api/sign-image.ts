import { v2 as cloudinary } from 'cloudinary'

export async function POST(request: Request) {
	try {
		if (!process.env.CLOUDINARY_API_SECRET) {
			return Response.json(
				{ error: 'Cloudinary API secret not configured' },
				{ status: 500 }
			)
		}

		const body = (await request.json()) as {
			paramsToSign: Record<string, string>
		}

		if (!body.paramsToSign || typeof body.paramsToSign !== 'object') {
			return Response.json(
				{ error: 'Invalid paramsToSign provided' },
				{ status: 400 }
			)
		}

		const { paramsToSign } = body
		const signature = cloudinary.utils.api_sign_request(
			paramsToSign,
			process.env.CLOUDINARY_API_SECRET!
		)

		return Response.json({
			signature,
		})
	} catch (error) {
		console.error('Error signing Cloudinary request:', error)
		return Response.json({ error: 'Internal server error' }, { status: 500 })
	}
}
