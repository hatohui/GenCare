import React from 'react'

const Layout = ({
	children,
	dashboard,
}: {
	dashboard: React.ReactNode
	children: React.ReactNode
}) => {
	return (
		<>
			<div>{children}</div>
			<div>{dashboard}</div>
		</>
	)
}

export default Layout
