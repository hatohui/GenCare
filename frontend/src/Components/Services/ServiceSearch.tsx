import FloatingLabelInput from '../Form/FloatingLabel'

export default function ServiceSearch({
	search,
}: {
	search: {
		value: string
		onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
		reset: () => void
	}
}) {
	return (
		<div className='px-6 py-4 flex items-center gap-4 w-full'>
			<svg
				xmlns='http://www.w3.org/2000/svg'
				fill='none'
				viewBox='0 0 24 24'
				stroke-width='1.5'
				stroke='currentColor'
				className='size-6'
			>
				<path
					stroke-linecap='round'
					stroke-linejoin='round'
					d='m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z'
				/>
			</svg>
			<FloatingLabelInput
				label='Tìm kiếm dịch vụ'
				id='search-service'
				autocomplete='off'
				{...search}
				className='w-full max-w-xl'
			/>
			<button className='rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition-colors'>
				Tìm kiếm
			</button>
		</div>
	)
}
