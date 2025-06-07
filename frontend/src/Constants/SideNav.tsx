import {
	AccountSVG,
	CustomerSVG,
	HomeSVG,
	MoneySVG,
	ServiceSVG,
} from '@/Components/SVGs'
import { RouterButtonProps } from '@/Components/NavBar/RouterButton'

export type SideNavButtonProp = RouterButtonProps & { svg: React.ReactNode }

export const SIDE_NAV_OPTIONS: SideNavButtonProp[] = [
	{ label: 'Home', to: '/dashboard', svg: <HomeSVG /> },
	{
		label: 'Invoices',
		to: '/dashboard/invoices',
		svg: <MoneySVG />,
	},
	{
		label: 'Quản lý tài khoản',
		to: '/dashboard/accounts',
		svg: <AccountSVG />,
	},
	{ label: 'Customers', to: '/dashboard/customers', svg: <CustomerSVG /> },
	{ label: 'Services', to: '/dashboard/services', svg: <ServiceSVG /> },
]
