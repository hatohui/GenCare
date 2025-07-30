import {
	Home,
	BarChart2,
	Users,
	Heart,
	Calendar,
	DollarSign,
	MessageCircle,
	ClipboardList,
	UserCheck,
	BookOpen,
	TestTube,
	ArrowLeftRight,
	LayoutDashboard,
} from 'lucide-react'
import { RouterButtonProps } from '@/Components/NavBar/RouterButton'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'

export type SideNavButtonProp = RouterButtonProps & {
	svg: React.ReactNode
	level: PermissionLevel
}

export const SIDE_NAV_OPTIONS: SideNavButtonProp[] = [
	{
		label: 'nav.goToApp',
		to: '/app',
		svg: <ArrowLeftRight size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.goToDashboard',
		to: '/dashboard',
		svg: <LayoutDashboard size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.home',
		to: '/dashboard',
		svg: <Home size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.home',
		to: '/app',
		svg: <Home size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.statistics',
		to: '/dashboard/statistics',
		svg: <BarChart2 size={20} />,
		level: PermissionLevel.admin,
	},
	{
		label: 'nav.accounts',
		to: '/dashboard/accounts',
		svg: <Users size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.services',
		to: '/dashboard/services',
		svg: <ClipboardList size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.schedules',
		to: '/dashboard/schedules',
		svg: <Calendar size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'nav.schedule',
		to: '/app/schedule',
		svg: <Calendar size={20} />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'nav.booking',
		to: '/app/booking',
		svg: <BookOpen size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.userServices',
		to: '/app/service',
		svg: <ClipboardList size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.tracking',
		to: '/app/birthcontrol',
		svg: <Heart size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.consultants',
		to: '/app/consultants',
		svg: <UserCheck size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.appointments',
		to: '/app/appointments',
		svg: <Calendar size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.payments',
		to: '/dashboard/payments',
		svg: <DollarSign size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.testResults',
		to: '/dashboard/tests',
		svg: <TestTube size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'nav.chat',
		to: '/app/chat',
		svg: <MessageCircle size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'nav.support',
		to: '/app/support',
		svg: <MessageCircle size={20} />,
		level: PermissionLevel.consultant,
	},
]
