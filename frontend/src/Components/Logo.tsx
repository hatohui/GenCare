import React from 'react'
import Image from 'next/image'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'

const Logo = ({
	className,
	withLabel = false,
}: {
	className?: string
	withLabel?: boolean
}) => {
	const router = useRouter()
	return (
		<div
			className={clsx(className, 'center-all gap-1 cursor-pointer select-none')}
			onClick={() => router.push('/')}
			title='Trang chủ GenCare'
			role='button'
			tabIndex={0}
			style={{ userSelect: 'none' }}
		>
			<Image
				src='/images/gencarelogo.png'
				alt='gencare-logo'
				width={1000}
				height={1000}
				className='object-contain w-8'
				quality={100}
				priority
				draggable={false}
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
