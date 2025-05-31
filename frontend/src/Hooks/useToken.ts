import { ACCOUNT_STORE_STRING } from '@/Constants/Auth'
import { Account } from '@/Interfaces/Auth/Types/Account'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type AccountStore = {
	account: Account | null
	setAccount: (newAccount: Account) => void
	removeAccount: () => void
}

const useAccountStore = create<AccountStore>()(
	persist(
		set => ({
			account: null,
			setAccount: newAccount => set({ account: newAccount }),
			removeAccount: () => set({ account: null }),
		}),
		{
			name: ACCOUNT_STORE_STRING,
			storage: createJSONStorage(() => sessionStorage),
		}
	)
)

export const accountActions = {
	setAccount: useAccountStore.getState().setAccount,
	removeAccount: useAccountStore.getState().removeAccount,
}

export default useAccountStore
