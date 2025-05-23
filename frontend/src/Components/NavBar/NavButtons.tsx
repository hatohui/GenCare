import React from 'react'
import { NavComponentProps } from '../NavBar'
import RouterButton from './RouterButton'
import { NAV_OPTIONS } from '@/Constants/NavBar'

const NavButtons = ({ onTop, className }: NavComponentProps) => {
	return (
		<div className={`gap-x-1 lg:gap-x-4 ${className}`}>
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
