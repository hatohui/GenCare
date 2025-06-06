'use client'

export type SearchBarProps = {
	handleSearch: (event: React.ChangeEvent<HTMLInputElement>) => void
	value: string
}

const SearchBar = ({ handleSearch, value }: SearchBarProps) => {
	return (
		<input
			type='text'
			id='search'
			placeholder='Search...'
			value={value}
			className='min-h-[2rem] border w-full rounded-sm p-2 ring-0 focus:ring-0 outline-none'
			onChange={handleSearch}
			autoComplete='off'
		/>
	)
}

export default SearchBar
