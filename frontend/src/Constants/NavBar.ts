import { RouterButtonProps } from '@/Components/NavBar/RouterButton'

export const NAV_TOP_OFFSET = 500
export const NAV_TOP_AREA = 100
export const NAV_TITLE = 'GENCARE'
export const NAV_ICON = ''
export const COLOR_ON_TOP = 'var(--color-main)'
export const COLOR_ON_SCROLL = 'var(--color-general)'
export const NAV_OPTIONS: RouterButtonProps[] = [
	{
		label: 'nav.home',
		to: '/',
	},
	{
		label: 'nav.services',
		to: '/service',
	},
	{
		label: 'nav.blog',
		to: '/blog',
	},
	{
		label: 'nav.contact',
		to: '/contact',
	},
]
