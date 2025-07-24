import NavBar from '@/Components/NavBar/NavBar'
import ClientHydration from '@/Components/ClientHydration'

export default function PublicLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ClientHydration>
				<NavBar />
			</ClientHydration>
			<main>{children}</main>
		</>
	)
}
