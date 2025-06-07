'use client'

import { motion } from 'motion/react'

export type SearchBarProps = {
	handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
	value: string
}

const SearchBar = ({ handleSearch, value }: SearchBarProps) => {
	return (
		<motion.input
			type='text'
			id='search'
			placeholder='Search...'
			value={value}
			className='min-h-[2rem] grow bg-main/10 border-2 text-slate-800 font-light rounded-sm p-2 ring-0 focus:ring-0 outline-none'
			onChange={handleSearch}
			autoComplete='off'
			tabIndex={0}
			whileFocus={{ borderColor: 'var(--color-accent)', borderWidth: '2px' }}
		/>
	)
}

export default SearchBar
