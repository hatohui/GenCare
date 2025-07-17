import ReturnButton from '@/Components/ReturnButton'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ReturnButton to='/' />
			<main>{children}</main>
		</>
	)
}
