// stores/authStore.ts
import { create } from 'zustand'
import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'

type AccountStore = {
	data: StaffAccount | null
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
	setAccount: (data: StaffAccount) => void
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
