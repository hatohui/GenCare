import NavBar from '@/Components/NavBar/NavBar'
import ClientHydration from '@/Components/ClientHydration'
import PopupChatWidget from '@/Components/Chat/PopupChatWidget'

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
			{/* Popup Chat Widget */}
			<PopupChatWidget />
		</>
	)
}
