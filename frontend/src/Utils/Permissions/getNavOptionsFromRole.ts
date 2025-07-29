import { SIDE_NAV_OPTIONS, SideNavButtonProp } from '@/Constants/SideNav'
import { isAllowedRole, Role } from './isAllowedRole'

export const getNavOptionsFromRole = (
	role: Role,
	currentPath: string
): SideNavButtonProp[] => {
	const seen = new Set<string>()

	const filtered = SIDE_NAV_OPTIONS.filter(option => {
		if (seen.has(option.label)) return false

		const allowed = isAllowedRole(role, option.level)

		if (option.label === 'nav.goToApp') {
			return (
				allowed &&
				currentPath === 'dashboard' &&
				(role === 'admin' || role === 'manager')
			)
		}

		if (option.label === 'nav.goToDashboard') {
			return (
				allowed &&
				currentPath === 'app' &&
				(role === 'staff' ||
					role === 'consultant' ||
					role === 'admin' ||
					role === 'manager')
			)
		}

		const pathMatch = currentPath === '/' || option.to.includes(currentPath)

		if (allowed && pathMatch) {
			seen.add(option.label)
			return true
		}

		return false
	})

	return filtered.sort((a, b) => {
		if (a.label === 'nav.goToApp' || a.label === 'nav.goToDashboard') return -1
		if (b.label === 'nav.goToApp' || b.label === 'nav.goToDashboard') return 1

		if (a.label === b.label) {
			if (a.to === '/dashboard') return -1
			if (b.to === '/dashboard') return 1
		}
		return 0
	})
}
