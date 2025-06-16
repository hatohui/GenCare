export enum PermissionLevel {
	admin,
	manager,
	staff,
	consultant,
	member,
}

export type Role = keyof typeof PermissionLevel

const ROLE_LEVEL_MAP: Record<PermissionLevel, string[]> = {
	[PermissionLevel.admin]: ['admin'],
	[PermissionLevel.manager]: ['admin', 'manager'],
	[PermissionLevel.staff]: ['admin', 'staff', 'manager'],
	[PermissionLevel.consultant]: ['admin', 'consultant'],
	[PermissionLevel.member]: ['admin', 'member'],
}

export const isAllowedRole = (
	role: string | undefined,
	level: PermissionLevel
): boolean => {
	if (!role) return false
	return ROLE_LEVEL_MAP[level]?.includes(role) ?? false
}
