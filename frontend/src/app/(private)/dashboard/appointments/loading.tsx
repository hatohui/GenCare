const Loading = () => {
	return (
		<div className='container mx-auto px-4 py-6'>
			<div className='space-y-6'>
				{/* Header skeleton */}
				<div className='flex items-center justify-between'>
					<div>
						<div className='h-8 w-32 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-4 w-48 bg-gray-200 rounded animate-pulse mt-2'></div>
					</div>
					<div className='flex items-center space-x-3'>
						<div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-10 w-28 bg-gray-200 rounded animate-pulse'></div>
						<div className='h-10 w-24 bg-gray-200 rounded animate-pulse'></div>
					</div>
				</div>

				{/* Timetable skeleton */}
				<div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
					<div className='overflow-x-auto'>
						<table className='w-full min-w-[800px]'>
							{/* Header */}
							<thead>
								<tr className='bg-gray-50'>
									<th className='w-24 px-4 py-3 border-b border-gray-200'>
										<div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
									</th>
									{Array.from({ length: 7 }).map((_, index) => (
										<th
											key={index}
											className='px-2 py-3 border-b border-gray-200 min-w-[150px]'
										>
											<div className='h-4 w-20 bg-gray-200 rounded animate-pulse mx-auto'></div>
										</th>
									))}
								</tr>
							</thead>

							{/* Body */}
							<tbody>
								{Array.from({ length: 8 }).map((_, rowIndex) => (
									<tr key={rowIndex} className='border-b border-gray-100'>
										<td className='px-4 py-2 border-r border-gray-200 bg-gray-50'>
											<div className='h-4 w-12 bg-gray-200 rounded animate-pulse'></div>
										</td>
										{Array.from({ length: 7 }).map((_, colIndex) => (
											<td key={colIndex} className='p-2'>
												<div className='min-h-[80px] border border-gray-200 p-2'>
													<div className='space-y-2'>
														<div className='h-3 w-full bg-gray-200 rounded animate-pulse'></div>
														<div className='h-3 w-3/4 bg-gray-200 rounded animate-pulse'></div>
														<div className='h-6 w-16 bg-gray-200 rounded animate-pulse'></div>
													</div>
												</div>
											</td>
										))}
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				{/* Summary skeleton */}
				<div className='bg-gray-50 rounded-lg p-4'>
					<div className='flex items-center justify-between'>
						<div className='h-4 w-48 bg-gray-200 rounded animate-pulse'></div>
						<div className='flex items-center space-x-4'>
							{Array.from({ length: 3 }).map((_, index) => (
								<div key={index} className='flex items-center'>
									<div className='w-3 h-3 bg-gray-200 rounded-full mr-2 animate-pulse'></div>
									<div className='h-4 w-16 bg-gray-200 rounded animate-pulse'></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Loading
