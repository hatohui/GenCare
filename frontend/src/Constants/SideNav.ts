import { RouterButtonProps } from '@/Components/NavBar/RouterButton'

export const SIDE_NAV_OPTIONS: RouterButtonProps[] = [
	{ label: 'Home', to: '/dashboard' },
	{
		label: 'Invoices',
		to: '/dashboard/invoices',
	},
	{ label: 'Customers', to: '/dashboard/customers' },
]
