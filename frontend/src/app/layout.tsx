import type { Metadata, Viewport } from 'next'
import { Geist_Mono, Inter } from 'next/font/google'
import './globals.css'
import { Suspense } from 'react'
import Script from 'next/script'
import TanstackProvider from '@/Components/Providers/TanstackProvider'
import LoadingPage from '@/Components/Loading'
import { Toaster } from 'react-hot-toast'

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
			<head>
				<link rel='icon' href='/favicon.ico' sizes='any' />
			</head>
			<body className={`${inter.variable} ${geistMono.variable} antialiased `}>
				<Suspense fallback={<LoadingPage />}>
					<TanstackProvider>{children}</TanstackProvider>
				</Suspense>
				<Toaster
					position='top-right'
					toastOptions={{
						duration: 4000,
						style: {
							background: '#363636',
							color: '#fff',
							borderRadius: '15px',
						},
						success: {
							iconTheme: {
								primary: '#10B981',
								secondary: '#fff',
							},
						},
						error: {
							iconTheme: {
								primary: '#EF4444',
								secondary: '#fff',
							},
						},
					}}
				/>
				<Script
					src='https://accounts.google.com/gsi/client'
					strategy='beforeInteractive'
					async
					defer
				/>
			</body>
		</html>
	)
}
