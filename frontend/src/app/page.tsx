'use client'
import useInput from '@/Hooks/Form/useInput'
import React from 'react'

const page = () => {
	const { reset: resetUserName, ...username } = useInput('', 'text')
	const { reset: resetPassword, ...password } = useInput('', 'password')

	return (
		<div>
			<input className='p-3 border-2' {...username} />
			<input className='p-3 border-2' {...password} />
		</div>
	)
}

export default page
