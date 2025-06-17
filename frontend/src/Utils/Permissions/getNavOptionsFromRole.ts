import { SIDE_NAV_OPTIONS, SideNavButtonProp } from '@/Constants/SideNav'
import { PermissionLevel, Role } from './isAllowedRole'

export const getNavOptionsFromRole = (
	role: Role,
	path: string
): SideNavButtonProp[] => {
	switch (role) {
		case 'admin':
			return SIDE_NAV_OPTIONS
		case 'manager':
			return SIDE_NAV_OPTIONS.filter(
				each => each.level >= PermissionLevel.manager && each.to.includes(path)
			)
		case 'staff':
			return SIDE_NAV_OPTIONS.filter(
				each => each.level >= PermissionLevel.staff && each.to.includes(path)
			)
		case 'consultant':
			return SIDE_NAV_OPTIONS.filter(
				each =>
					each.level >= PermissionLevel.consultant && each.to.includes(path)
			)
		case 'member':
			return SIDE_NAV_OPTIONS.filter(
				each => each.level >= PermissionLevel.member && each.to.includes(path)
			)
	}
}
