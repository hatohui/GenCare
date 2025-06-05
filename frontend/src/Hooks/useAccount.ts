// stores/authStore.ts
import { create } from 'zustand'
import { DecodedTokenData } from '@/Interfaces/Auth/Schema/token'

type AccountStore = {
	data: DecodedTokenData | null
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
	setAccount: (data: DecodedTokenData) => void
	removeAccount: () => void
}

export const useAccountStore = create<AccountStore>(set => ({
	data: null,
	isLoading: true,

	setIsLoading: isLoading => set({ isLoading }),

	setAccount: data =>
		set({
			data,
			isLoading: false,
		}),

	removeAccount: () =>
		set({
			data: null,
			isLoading: false,
		}),
}))
