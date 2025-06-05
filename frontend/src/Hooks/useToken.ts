import { TokenizedAccount } from '@/Interfaces/Auth/Schema/token'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type AccountStore = {
	account: TokenizedAccount | null
	accessToken: string | null
	setAccessToken: (token: string) => void
	removeAccessToken: () => void
	setAccount: (newAccount: TokenizedAccount) => void
	removeAccount: () => void
}

const useAccountStore = create<AccountStore>()(
	persist(
		set => ({
			account: null,
			accessToken: null,
			setAccessToken: (token: string) => set({ accessToken: token }),

			removeAccessToken: () => {
				set({ accessToken: null, account: null })
			},
			setAccount: (newAccount: TokenizedAccount) =>
				set({ account: newAccount }),
			removeAccount: () => set({ account: null }),
		}),
		{
			name: 'account-store', // The key name for localStorage
			storage: {
				setItem: (key, value) =>
					localStorage.setItem(key, JSON.stringify(value)),
				getItem: key => {
					const value = localStorage.getItem(key)
					return value ? JSON.parse(value) : null
				},
				removeItem: key => localStorage.removeItem(key),
			} as const, // Correct option here for using localStorage
		}
	)
)

export const accountActions = {
	setAccount: useAccountStore.getState().setAccount,
	removeAccount: useAccountStore.getState().removeAccount,
	removeAccessToken: useAccountStore.getState().removeAccessToken,
	setAccessToken: useAccountStore.getState().setAccessToken,
}

export default useAccountStore
