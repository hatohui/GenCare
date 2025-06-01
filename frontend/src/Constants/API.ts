export const DEFAULT_API_URL =
	process.env.NODE_ENV === 'production'
		? 'https://api.gencare.site/api'
		: 'http://localhost:8080/api'
