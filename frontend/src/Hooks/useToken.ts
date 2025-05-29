import { Account } from '@/Interfaces/Auth/Types/Account'
import { create } from 'zustand'

export type AccountStore = {
	account: Account | null
	setAccount: (newAccount: Account) => void
}

const useAccountStore = create<AccountStore>(set => ({
	account: null,
	setAccount: (newAccount: Account) =>
		set(state => ({ ...state, account: newAccount })),
	removeAccount: () => set(state => ({ ...state, account: null })),
}))

export default useAccountStore
