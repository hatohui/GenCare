'use client'
import React, { useState, createContext } from 'react'

export const PaginationContext = createContext<{
	page: number
	setPage: React.Dispatch<React.SetStateAction<number>>
}>({ page: 1, setPage: () => {} })
const Layout = ({
	children,
	actions,
}: {
	children: React.ReactNode
	actions: React.ReactNode
}) => {
	const [page, setPage] = useState(1)

	return (
		<div className='flex flex-col h-full w-full gap-4'>
			<div className=''>{actions}</div>
			<PaginationContext.Provider value={{ page, setPage }}>
				<div className='flex flex-col flex-2/3'>{children}</div>
			</PaginationContext.Provider>
		</div>
	)
}

export default Layout
