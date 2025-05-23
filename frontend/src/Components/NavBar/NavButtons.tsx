import React from 'react'
import { NavComponentProps } from '../NavBar'
import { NAV_OPTIONS } from '@/Constants/NavBar'
import RouterButton from './RouterButton'

const NavButtons = ({ onTop, className }: NavComponentProps) => {
	return (
		<div className={`gap-x-8 ${className}`}>
			{NAV_OPTIONS.map((button, key) => (
				<RouterButton
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
