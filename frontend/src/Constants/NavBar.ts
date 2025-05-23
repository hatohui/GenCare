import { RouterButtonProps } from '@/Components/NavBar/RouterButton'

export const NAV_TITLE = 'GENCARE'
export const NAV_ICON = ''
export const COLOR_ON_TOP = 'var(--color-main)'
export const COLOR_ON_SCROLL = 'var(--color-general)'
export const NAV_OPTIONS: RouterButtonProps[] = [
	{
		label: 'About Us',
		to: '/',
	},
	{
		label: 'Services',
		to: '/service',
	},
	{
		label: 'Blogs',
		to: '/blog',
	},
	{
		label: 'Contact',
		to: '/contact',
	},
]
