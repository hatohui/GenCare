'use client'
import React, { useState } from 'react'

type User = {
	name: string
	online: boolean
	lastSeen: string
}

const users: User[] = [
	{ name: 'Alice', online: true, lastSeen: 'Online now' },
	{ name: 'Bob', online: false, lastSeen: 'Last seen 5 minutes ago' },
	{ name: 'Charlie', online: true, lastSeen: 'Online now' },
	{ name: 'David', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Eve', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Frank', online: true, lastSeen: 'Online now' },
	{ name: 'George', online: false, lastSeen: 'Last seen 5 minutes ago' },
	{ name: 'Hannah', online: true, lastSeen: 'Online now' },
	{ name: 'Ivan', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Julia', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Kevin', online: true, lastSeen: 'Online now' },
	{ name: 'Lucas', online: false, lastSeen: 'Last seen 5 minutes ago' },
	{ name: 'Matthew', online: true, lastSeen: 'Online now' },
	{ name: 'Natalie', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Olivia', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Patrick', online: true, lastSeen: 'Online now' },
	{ name: 'Quincy', online: false, lastSeen: 'Last seen 5 minutes ago' },
	{ name: 'Ruby', online: true, lastSeen: 'Online now' },
	{ name: 'Samantha', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Tanya', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Uma', online: true, lastSeen: 'Online now' },
	{ name: 'Vivian', online: false, lastSeen: 'Last seen 5 minutes ago' },
	{ name: 'Walter', online: true, lastSeen: 'Online now' },
	{ name: 'Xavier', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Yvonne', online: false, lastSeen: 'Last seen yesterday' },
	{ name: 'Zoe', online: true, lastSeen: 'Online now' },
]

const Page = () => {
	const [selectedUser, setSelectedUser] = useState<string | null>(null)

	const handleSelectUser = (user: string) => {
		setSelectedUser(user)
	}

	const getInitials = (name: string) => {
		return name
			.split(' ')
			.map(part => part[0])
			.join('')
			.toUpperCase()
	}

	return (
		<div className='flex flex-col w-full h-full max-w-md mx-auto p-4 bg-white rounded-2xl shadow-md border'>
			<h1 className='text-2xl font-bold text-accent mb-4'>Contacts</h1>
			<ul className='divide-y divide-gray-200 overflow-auto scroll-bar'>
				{users.map(user => (
					<li
						key={user.name}
						onClick={() => handleSelectUser(user.name)}
						className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
							selectedUser === user.name
								? 'bg-gradient-to-l from-main/90 to-secondary/90 text-white'
								: 'hover:bg-gray-100'
						}`}
					>
						{/* Avatar */}
						<div className='relative w-10 h-10 rounded-full bg-gray-300 text-white flex items-center justify-center font-semibold mr-4'>
							{getInitials(user.name)}
							{user.online && (
								<span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full'></span>
							)}
						</div>

						{/* User Info */}
						<div className='flex-1'>
							<p className='font-medium text-base'>{user.name}</p>
							<p
								className={`text-sm ${
									selectedUser === user.name ? 'text-white/80' : 'text-gray-500'
								}`}
							>
								{user.lastSeen}
							</p>
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}

export default Page
