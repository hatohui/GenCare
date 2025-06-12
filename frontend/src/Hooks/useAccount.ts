// stores/authStore.ts
import { create } from 'zustand'
import { Account } from '@/Interfaces/Auth/Types/Account'

type AccountStore = {
	data: Account | null
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
	setAccount: (data: Account) => void
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
