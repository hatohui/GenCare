import { TokenizedAccount } from '@/Interfaces/Auth/Schema/token'
import { create } from 'zustand'

export type AccountStore = {
	account: TokenizedAccount | null
	accessToken: string | null
	setAccessToken: (token: string) => void
	removeAccessToken: () => void
	setAccount: (newAccount: TokenizedAccount) => void
	removeAccount: () => void
}

const useAccountStore = create<AccountStore>()(set => ({
	account: null,
	accessToken: null,
	setAccessToken: (token: string) => set({ accessToken: token }),
	removeAccessToken: () => {
		set({ accessToken: null, account: null })
	},
	setAccount: newAccount => set({ account: newAccount }),
	removeAccount: () => set({ account: null }),
}))

export const accountActions = {
	setAccount: useAccountStore.getState().setAccount,
	removeAccount: useAccountStore.getState().removeAccount,
	removeAccessToken: useAccountStore.getState().removeAccessToken,
	setAccessToken: useAccountStore.getState().setAccessToken,
}

export default useAccountStore
