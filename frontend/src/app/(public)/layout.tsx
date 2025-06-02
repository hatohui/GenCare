import NavBar from '@/Components/NavBar/NavBar'

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<NavBar />
			<main>{children}</main>
		</>
	)
}
