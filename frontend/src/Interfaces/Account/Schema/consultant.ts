import { Consultant } from '../Types/Consultant'

//----------------------------------------
/**
 * GET /api/accounts/consultants
 *
 * @remarks
 * Retrieves a paginated list of consultants with optional search filtering
 *
 * @param page - Page number for pagination (starts from 1)
 * @param count - Number of consultants per page (must be positive)
 * @param search - Optional keyword to filter consultants
 * @returns {200} Success response with paginated consultants
 */
export type GetConsultantsRequest = {
	page: number
	count: number
	search?: string | null
}

export type GetConsultantsResponse = {
	totalCount: number
	consultants: Consultant[]
}
