import { ConsultantProvider } from '@/Components/Consultant/ConsultantContext'

export default function Layout({ children }: { children: React.ReactNode }) {
	return <ConsultantProvider>{children}</ConsultantProvider>
}
