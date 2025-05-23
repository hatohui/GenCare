import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Providers from './Provider'
import NavBar from '@/Components/NavBar'
import CustomCursor from '@/Components/CustomCursor'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Gencare',
	description:
		'A gender healthcare management system for streamlined patient care and administration.',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<NavBar />
				<Providers>
					<CustomCursor />
					{children}
				</Providers>

				<div className='fixed top-0 left-0 w-screen h-screen bg-general' />
			</body>
		</html>
	)
}
