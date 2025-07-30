import ReturnButton from '@/Components/ReturnButton'

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<>
			<ReturnButton to='/' className='absolute top-4 left-4 z-999' />
			<main>{children}</main>
		</>
	)
}
