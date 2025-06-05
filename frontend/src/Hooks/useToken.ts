import { TokenizedAccount } from '@/Interfaces/Auth/Schema/token'
import { create } from 'zustand'

export type AccountStore = {
	account: TokenizedAccount | null
	accessToken: string | null
	removeAccessToken: () => void
	setAccount: (newAccount: TokenizedAccount) => void
	removeAccount: () => void
}

const useAccountStore = create<AccountStore>()(set => ({
	account: null,
	accessToken: null,
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
}

export default useAccountStore
