//----------------------------------------
/**
 * GET /api/accounts/
 *
 * @remarks
 * Retrieves account information
 *
 * @requires header - access-token
 * @returns {200} Success response status
 */

import { Account } from '@/Interfaces/Auth/Types/Account'
import { StaffInfo } from '../Types/StaffInfo'
import { StaffAccount } from '../Types/StaffAccount'

export type GetAccountByPageRequest = {
	page: number
	count: number
}

export type GetAccountByPageResponse = {
	accounts: []
}

//----------------------------------------
/**
 * GET /api/account/:id
 *
 * @remark
 * Create a new account
 *
 * @requires header - access-token
 * @return {200} Success response status
 */
export type GetAccountByIdRequest = {
	id: string
}

export type GetAccountByIdResponse = Account

//------------------------------- ---------
/**
 * POST /api/account/
 *
 * @remark
 * Create a new account
 *
 * @requires header - access-token
 * @return {201} Created success status
 */
export type PostAccountRequest = {
	account: Omit<Account, 'id' | 'deletedAt' | 'isDeleted' | 'deletedBy'>
	staffInfo: Omit<StaffInfo, 'accountId' | 'departmentId'>
	department: string
}

export type PostAccountResponse = {
	staffAccount: StaffAccount
}
