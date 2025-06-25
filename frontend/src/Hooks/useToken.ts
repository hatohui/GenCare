import { TOKEN_STORE_STRING } from '@/Constants/Auth'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

export type TokenStore = {
	accessToken: string | null
	isHydrated: boolean
	setAccessToken: (token: string) => void
	removeAccessToken: () => void
}

const useToken = create<TokenStore>()(
	persist(
		set => ({
			accessToken: null,
			isHydrated: false,
			setAccessToken: (token: string) => set({ accessToken: token }),
			removeAccessToken: () => set({ accessToken: null, isHydrated: false }),
		}),
		{
			name: TOKEN_STORE_STRING,
			storage: createJSONStorage(() => sessionStorage),
			partialize: state => ({ accessToken: state.accessToken }),
			onRehydrateStorage: () => {
				return (state, error) => {
					if (error) {
						console.error('Rehydration error:', error)
						return
					}
					if (state) state.isHydrated = true
				}
			},
		}
	)
)

export default useToken
