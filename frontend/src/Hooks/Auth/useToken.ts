import { TOKEN_STORE_STRING } from '@/Constants/Auth'
import { create } from 'zustand'

export type TokenStore = {
	accessToken: string | null
	isHydrated: boolean
	setAccessToken: (token: string, rememberMe?: boolean) => void
	removeAccessToken: () => void
	setRememberMe: (remember: boolean) => void
	removeRememberMe: () => void
}

const getRememberMe = () => {
	if (typeof window === 'undefined') return false
	return localStorage.getItem('rememberMe') === 'true'
}

const getStoredToken = () => {
	if (typeof window === 'undefined') return null
	if (getRememberMe()) {
		return localStorage.getItem('accessToken')
	} else {
		return sessionStorage.getItem('accessToken')
	}
}

const useToken = create<TokenStore>()((set, get) => ({
	accessToken: getStoredToken(),
	isHydrated: true,
	setAccessToken: (token: string, rememberMe = false) => {
		if (rememberMe) {
			localStorage.setItem('accessToken', token)
			localStorage.setItem('rememberMe', 'true')
			sessionStorage.removeItem('accessToken')
		} else {
			sessionStorage.setItem('accessToken', token)
			localStorage.removeItem('accessToken')
			localStorage.removeItem('rememberMe')
		}
		set({ accessToken: token })
	},
	removeAccessToken: () => {
		localStorage.removeItem('accessToken')
		localStorage.removeItem('rememberMe')
		sessionStorage.removeItem('accessToken')
		set({ accessToken: null, isHydrated: true })
	},
	setRememberMe: (remember: boolean) => {
		if (remember) {
			localStorage.setItem('rememberMe', 'true')
		} else {
			localStorage.removeItem('rememberMe')
		}
	},
	removeRememberMe: () => {
		localStorage.removeItem('rememberMe')
	},
}))

export default useToken
