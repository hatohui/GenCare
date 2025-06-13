import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'

const Logo = ({
	className,
	withLabel = false,
}: {
	className?: string
	withLabel?: boolean
}) => {
	return (
		<div className={clsx(className, 'center-all gap-1')}>
			<Image
				src='/images/gencarelogo.png'
				alt='gencare-logo'
				width={1000}
				height={1000}
				className='object-contain w-8'
				quality={100}
				priority
			/>
			{withLabel && (
				<div>
					<h1 className='font-semibold text-xl h-full leading-none'>
						<span className='text-accent'>G</span>enCare
					</h1>
				</div>
			)}
		</div>
	)
}

export default Logo
