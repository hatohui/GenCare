import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { StaffAccount } from '@/Interfaces/Account/Types/StaffAccount'
import { ACCOUNT_STORE_STRING } from '@/Constants/Auth'

type AccountStore = {
	data: StaffAccount | null
	isLoading: boolean
	setIsLoading: (isLoading: boolean) => void
	setAccount: (data: StaffAccount) => void
	removeAccount: () => void
}

export const useAccountStore = create<AccountStore>()(
	persist(
		set => ({
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
		}),
		{
			name: ACCOUNT_STORE_STRING,
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)
