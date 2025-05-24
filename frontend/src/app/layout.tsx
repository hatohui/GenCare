import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import Providers from './Provider'
import NavBar from '@/Components/NavBar'
import CustomCursor from '@/Components/CustomCursor'

const inter = Inter({
	variable: '--font-inter',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
}

export const metadata: Metadata = {
	title: 'Gencare - Hệ thống Quản lý Y tế Giới tính',
	description:
		'Hệ thống quản lý y tế giới tính để hợp lý hóa chăm sóc bệnh nhân và quản trị.',
	keywords: [
		'y tế giới tính',
		'quản lý y tế',
		'chăm sóc bệnh nhân',
		'quản trị y tế',
		'hệ thống y tế',
	],
	authors: [{ name: 'Đội ngũ Gencare' }],
	robots: 'index, follow',
	openGraph: {
		title: 'Gencare - Hệ thống Quản lý Y tế Giới tính',
		description:
			'Hệ thống quản lý y tế giới tính để hợp lý hóa chăm sóc bệnh nhân và quản trị.',
		type: 'website',
		locale: 'vi_VN',
		siteName: 'Gencare',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'Gencare - Hệ thống Quản lý Y tế Giới tính',
		description:
			'Hệ thống quản lý y tế giới tính để hợp lý hóa chăm sóc bệnh nhân và quản trị.',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='vi'>
			<body className={`${inter.variable} ${geistMono.variable} antialiased`}>
				<NavBar />
				<CustomCursor />
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
