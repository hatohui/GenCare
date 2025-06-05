import { accountActions } from '@/Hooks/useToken'

export const removeTokens = () => {
	accountActions.removeAccessToken()
	accountActions.removeAccount()
}
