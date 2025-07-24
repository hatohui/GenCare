import React from 'react'

const Layout = ({
	children,
	scheduleTable,
}: {
	children: React.ReactNode
	scheduleTable: React.ReactNode
}) => {
	return (
		<>
			<div>{scheduleTable} </div>
			<div>{children}</div>
		</>
	)
}

export default Layout
