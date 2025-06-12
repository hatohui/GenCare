import React from 'react'
import NavLinks from './NavLink'
import Logo from '../Logo'
import UserProfile from './UserProfile'

export default function SideNav() {
	return (
		<div className='relative overflow-visible'>
			<button
				aria-label='side-bar-toggle'
				className='absolute right-0 size-8 bg-accent overflow-visible'
			/>

			<div className='flex md:h-screen flex-col text-white py-1 md:py-5 md:w-60 main-gradient-bg'>
				<div className='center-all show-pc-only pointer-events-none py-5 pb-10 hidden'>
					<Logo className='h-full w-full flex-1' withLabel />
				</div>

				<div className='flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2'>
					<div className='text-xs font-medium px-4 md:space-x-0 show-pc-only'>
						Menu
					</div>

					<NavLinks />

					<div className='center-all'>
						<div className='h-[2px] round bg-gray-300 w-11/12' />
					</div>

					<div className='hidden w-full grow md:block' />

					<UserProfile />
				</div>
			</div>
		</div>
	)
}
