'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { OptionSVG } from '../SVGs'
import Popup from './Popup'

const UserProfile = () => {
	const [showPopUp, setShowPopUp] = useState(false)

	return (
		<div className='hidden md:flex justify-start items-center gap-2 border rounded-sm px-2 py-1'>
			{showPopUp && <Popup />}
			<Image
				className='rounded-full bg-amber-50 object-cover'
				src='/'
				alt='avatar'
				width={30}
				height={30}
			/>

			<div>
				<div className='text-sm text-general'>exampleName</div>
				<div className='text-xs text-slate-300'>example.email.com</div>
			</div>

			<button
				className='justify-self-end bg-accent'
				onClick={() => setShowPopUp(prev => !prev)}
			>
				<OptionSVG />
			</button>
		</div>
	)
}

export default UserProfile
