import React from 'react'
import RouterButton from './RouterButton'
import { NAV_OPTIONS } from '@/Constants/NavBar'
import clsx from 'clsx'
import { NavComponentProps } from '@/Interfaces/NavBar/Types/NavBarComponents'

const NavButtons = ({ onTop, className }: NavComponentProps) => {
	return (
		<div className={clsx('gap-x-1 lg:gap-x-4', className)}>
			{NAV_OPTIONS.map((button, key) => (
				<RouterButton
					index={key}
					key={`nav_${key}`}
					label={button.label}
					to={button.to}
					onTop={onTop}
				/>
			))}
		</div>
	)
}

export default NavButtons
