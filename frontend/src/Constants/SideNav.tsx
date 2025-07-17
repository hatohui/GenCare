import {
	Home,
	BarChart2,
	Users,
	User,
	Heart,
	Calendar,
	Clock,
	DollarSign,
	MessageCircle,
	ClipboardList,
	UserCheck,
	PieChart,
	BookOpen,
	TestTube,
} from 'lucide-react'
import { RouterButtonProps } from '@/Components/NavBar/RouterButton'
import { PermissionLevel } from '@/Utils/Permissions/isAllowedRole'

export type SideNavButtonProp = RouterButtonProps & {
	svg: React.ReactNode
	level: PermissionLevel
}

export const SIDE_NAV_OPTIONS: SideNavButtonProp[] = [
	{
		label: 'Trang chủ',
		to: '/dashboard',
		svg: <Home size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Trang chủ',
		to: '/app',
		svg: <Home size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Thống kê',
		to: '/dashboard/statistics',
		svg: <BarChart2 size={20} />,
		level: PermissionLevel.admin,
	},
	{
		label: 'Tài khoản',
		to: '/dashboard/accounts',
		svg: <Users size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Khách hàng',
		to: '/app/customers',
		svg: <User size={20} />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'Dịch vụ',
		to: '/dashboard/services',
		svg: <ClipboardList size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Ca làm việc',
		to: '/dashboard/slots',
		svg: <Clock size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Lịch trình',
		to: '/dashboard/schedules',
		svg: <Calendar size={20} />,
		level: PermissionLevel.manager,
	},
	{
		label: 'Phân tích',
		to: '/dashboard/analytics',
		svg: <PieChart size={20} />,
		level: PermissionLevel.admin,
	},
	{
		label: 'Lịch',
		to: '/app/schedule',
		svg: <Calendar size={20} />,
		level: PermissionLevel.consultant,
	},
	{
		label: 'Đặt lịch',
		to: '/app/booking',
		svg: <BookOpen size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Dịch vụ của bạn',
		to: '/app/service',
		svg: <ClipboardList size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Theo dõi',
		to: '/app/birthcontrol',
		svg: <Heart size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Chuyên gia',
		to: '/app/consultants',
		svg: <UserCheck size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Cuộc hẹn',
		to: '/app/appointments',
		svg: <Calendar size={20} />,
		level: PermissionLevel.member,
	},
	{
		label: 'Thanh toán',
		to: '/dashboard/payments',
		svg: <DollarSign size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Kết quả xét nghiệm',
		to: '/dashboard/tests',
		svg: <TestTube size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Cuộc hẹn',
		to: '/dashboard/appointments',
		svg: <Calendar size={20} />,
		level: PermissionLevel.staff,
	},
	{
		label: 'Trò chuyện với chúng tôi',
		to: '/app/chat',
		svg: <MessageCircle size={20} />,
		level: PermissionLevel.member,
	},
]
