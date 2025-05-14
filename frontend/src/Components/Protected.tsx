import { useToken } from '@/Hooks/useToken'
import React from 'react'

const ProtectedPage = ({
	children,
}: Readonly<{
	children: React.ReactNode
}>) => {
	const token = useToken()

	return <div>{children}</div>
}

export default ProtectedPage
