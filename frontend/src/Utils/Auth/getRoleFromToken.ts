import { Role } from '../Permissions/isAllowedRole'
import { decodeToken } from './decodeToken'

export const getRoleFromToken = (token: string): Role => {
	return decodeToken(token)?.account?.role?.name ?? 'member'
}
