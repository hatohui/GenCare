import { Account } from '@/Interfaces/Auth/Types/Account'
import { StaffInfo } from '../Types/StaffInfo'
import { StaffAccount } from '../Types/StaffAccount'
import { RegisterApi } from '@/Interfaces/Auth/Schema/register'
import { z } from 'zod'

//----------------------------------------
/**
 * Account Form Schema for creating/updating accounts
 */
export const accountFormSchema = z.object({
	firstName: z
		.string()
		.min(1, 'First name is required')
		.max(30, 'First name is too long'),
	lastName: z
		.string()
		.min(1, 'Last name is required')
		.max(30, 'Last name is too long'),
	email: z.string().email('Invalid email format').min(1, 'Email is required'),
	phoneNumber: z
		.string()
		.min(1, 'Phone number is required')
		.regex(/^\+?\d{8,15}$/, 'Invalid phone number format'),
	gender: z.boolean(),
	dateOfBirth: z.string().optional(),
	isDeleted: z.boolean().optional(),
	avatarUrl: z.string().optional(),
	degree: z.string().optional(),
	yearOfExperience: z.coerce
		.number()
		.min(0, 'Years of experience must be non-negative')
		.optional(),
	biography: z.string().optional(),
})

// Create a schema for editing that makes most fields optional
export const accountEditSchema = z.object({
	firstName: z
		.string()
		.max(30, 'First name is too long')
		.optional()
		.or(z.string().min(1, 'First name cannot be empty')),
	lastName: z
		.string()
		.max(30, 'Last name is too long')
		.optional()
		.or(z.string().min(1, 'Last name cannot be empty')),
	email: z
		.string()
		.email('Invalid email format')
		.optional()
		.or(z.string().min(1, 'Email cannot be empty')),
	phoneNumber: z
		.string()
		.regex(/^\+?\d{8,15}$/, 'Invalid phone number format')
		.optional()
		.or(z.string().min(1, 'Phone number cannot be empty')),
	gender: z.boolean().optional(),
	dateOfBirth: z.string().optional(),
	isDeleted: z.boolean().optional(),
	avatarUrl: z.string().optional(),
	degree: z.string().optional(),
	yearOfExperience: z.coerce
		.number()
		.min(0, 'Years of experience must be non-negative')
		.optional(),
	biography: z.string().optional(),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
export type AccountEditData = z.infer<typeof accountEditSchema>

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
