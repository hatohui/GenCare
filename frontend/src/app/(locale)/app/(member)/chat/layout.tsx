import React from 'react'

const Layout = ({
	contacts,
	children,
}: {
	contacts: React.ReactNode
	children: React.ReactNode
}) => {
	return (
		<main className='flex h-full gap-4'>
			<section className='h-full w-full'>{children}</section>
			<section className='h-full min-w-xs'>{contacts}</section>
		</main>
	)
}

export default Layout
