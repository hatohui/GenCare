import { Account } from '@/Interfaces/Auth/Types/Account'
import { StaffAccount } from '../Types/StaffAccount'
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
		.optional()
		.refine(
			val => !val || /^\+?\d{8,15}$/.test(val),
			'Invalid phone number format'
		),
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
	departmentId: z.string().optional(),
	roleId: z.string().optional(),
})

// Schema for account creation with password fields and conditional validation
export const createAccountSchema = z
	.object({
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
			.optional()
			.refine(
				val => !val || /^\+?\d{8,15}$/.test(val),
				'Invalid phone number format'
			),
		gender: z.boolean(),
		dateOfBirth: z.string().min(1, 'Date of birth is required'),
		password: z.string().min(6, 'Password must be at least 6 characters'),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
		roleId: z.string().min(1, 'Role is required'),
		degree: z.string().optional(),
		yearOfExperience: z.coerce
			.number()
			.min(0, 'Years of experience must be non-negative')
			.optional(),
		biography: z.string().optional(),
		departmentId: z.string().optional(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

// Create a schema for editing that makes most fields optional
export const accountEditSchema = z.object({
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
		.optional()
		.refine(
			val => !val || /^\+?\d{8,15}$/.test(val),
			'Invalid phone number format'
		),
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
	departmentId: z.string().optional(),
	roleId: z.string().optional(),
})

export type AccountFormData = z.infer<typeof accountFormSchema>
export type AccountEditData = z.infer<typeof accountEditSchema>
export type CreateAccountFormData = z.infer<typeof createAccountSchema>

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
export type CreateAccountRequest = {
	account: {
		email: string
		roleId: string
		firstName: string
		lastName: string
		avatarUrl?: string
		gender: boolean
		phoneNumber?: string
		dateOfBirth?: string
		password: string
	}
	staffInfo?: {
		departmentId?: string
		degree?: string
		yearOfExperience?: number
		biography?: string
	}
}

export type CreateAccountResponse = StaffAccount

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
	account: {
		firstName?: string
		lastName?: string
		phoneNumber?: string
		email?: string
		roleId?: string
		gender?: boolean
		dateOfBirth?: string
		avatarUrl?: string
		isDeleted?: boolean
	}
	staffInfo?: {
		departmentId?: string
		degree?: string
		yearOfExperience?: number
		biography?: string
	}
}

export type PutAccountResponse = StaffAccount
