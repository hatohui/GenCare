import React, { use } from 'react'

const Page = ({ params }: { params: Promise<{ id: string }> }) => {
	const { id } = use(params)

	return <div></div>
}

export default Page
