export const DEFAULT_API_URL = 'https://api.gencare.site/api'

// Payment callback URLs
export const PAYMENT_SUCCESS_URL =
	'/app/payment-callback?resultCode=0&message=Thanh%20to%C3%A1n%20th%C3%A0nh%20c%C3%B4ng'
export const PAYMENT_FAILED_URL =
	'/app/payment-callback?resultCode=1&message=Thanh%20to%C3%A1n%20th%E1%BA%A5t%20b%E1%BA%A1i'
export const PAYMENT_CANCEL_URL =
	'/app/payment-callback?resultCode=2&message=Thanh%20to%C3%A1n%20b%E1%BB%8B%20h%E1%BB%A7y'
