import { createContext, useState, useEffect, useContext } from 'react'

interface AuthContextType {
	token: string | null
	login: (newToken: string) => void
	logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: any) {
	const [token, setToken] = useState<string | null>(null)

	useEffect(() => {
		const storedToken = sessionStorage.getItem('access_token')
		if (storedToken) setToken(storedToken)
	}, [])

	const login = (newToken: string) => {
		sessionStorage.setItem('access_token', newToken)
		setToken(newToken)
	}

	const logout = () => {
		sessionStorage.removeItem('access_token')
		setToken(null)
	}

	return (
		<AuthContext.Provider value={{ token, login, logout }}>
			{children}
		</AuthContext.Provider>
	)
}

export const useAuth = () => useContext(AuthContext)
