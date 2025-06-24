import { Account } from '@/Interfaces/Auth/Types/Account'
import { StaffInfo } from '../Types/StaffInfo'
import { StaffAccount } from '../Types/StaffAccount'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'

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
export type GetAccountByPageResponse = {
	totalCount: number
	accounts: Account[]
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
 * @return {StaffAccount} details of the account
 */
export type GetAccountByIdRequest = {
	id: string
}

export type GetAccountByIdResponse = StaffAccount

//------------------------------- ---------
/**
 * POST /api/account/
 *
 * @remark
 * Create a new staff account
 *
 * @requires header - access-token
 * @return {201} Created success status
 * @return {StaffAccount} newly created Account
 */
export type PostAccountRequest = {
	account: RegisterApi
	staffInfo?: Omit<StaffInfo, 'accountId' | 'departmentId'>
	department?: string
}

export type PostAccountResponse = StaffAccount

//------------------------------- ---------
/**
 * DELETE /api/account/:id
 *
 * @remark
 * Delete an account
 *
 * @requires header - access-token
 * @return {204} No Content success status
 */
export type DeleteAccountRequest = {
	id: string
}

export type DeleteAccountResponse = Required<
	Pick<Account, 'id' | 'email' | 'deletedAt' | 'deletedBy' | 'isDeleted'>
>

//------------------------------- ---------
/**
 * PUT /api/account/:id
 *
 * @remark
 * Update an existing account
 *
 * @requires header - access-token
 * @return {200} Success response status
 * @return {StaffAccount} updated account
 */
export type PutAccountRequest = {
	account: Partial<Omit<Account, 'deletedAt' | 'deletedBy'>>
	staffInfo?: Partial<Omit<StaffInfo, 'accountId' | 'departmentId'>>
	department?: string
}

export type PutAccountResponse = StaffAccount
