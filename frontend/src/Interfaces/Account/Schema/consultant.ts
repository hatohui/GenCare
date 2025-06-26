import { Consultant } from '../Types/Consultant'

//----------------------------------------
/**
 * GET /api/consultants/
 *
 * @remarks
 * Retrieves consultant information
 *
 * @requires header - access-token
 * @returns {200} Success response status
 */
export type GetConsultantByPageResponse = {
	totalCount: number
	consultants: Consultant[]
}

//----------------------------------------
/**
 * GET /api/consultant/:id
 *
 * @remarks
 * Retrieves a consultant by id
 *
 * @requires header - access-token
 * @returns {200} Success response status
 * @returns {Consultant} details of the consultant
 */
export type GetConsultantByIdRequest = {
	id: string
}

export type GetConsultantByIdResponse = Consultant

//----------------------------------------
/**
 * POST /api/consultant/
 *
 * @remarks
 * Create a new consultant
 *
 * @requires header - access-token
 * @returns {201} Created success status
 * @returns {Consultant} newly created Consultant
 */
export type PostConsultantRequest = Omit<
	Consultant,
	'id' | 'deletedAt' | 'deletedBy' | 'isDeleted'
>

export type PostConsultantResponse = Consultant

//----------------------------------------
/**
 * DELETE /api/consultant/:id
 *
 * @remarks
 * Delete a consultant
 *
 * @requires header - access-token
 * @returns {204} No Content success status
 */
export type DeleteConsultantRequest = {
	id: string
}

export type DeleteConsultantResponse = Required<
	Pick<Consultant, 'id' | 'email' | 'deletedAt' | 'deletedBy' | 'isDeleted'>
>

//----------------------------------------
/**
 * PUT /api/consultant/:id
 *
 * @remarks
 * Update an existing consultant
 *
 * @requires header - access-token
 * @returns {200} Success response status
 * @returns {Consultant} updated consultant
 */
export type PutConsultantRequest = Partial<
	Omit<Consultant, 'deletedAt' | 'deletedBy'>
>

export type PutConsultantResponse = Consultant
