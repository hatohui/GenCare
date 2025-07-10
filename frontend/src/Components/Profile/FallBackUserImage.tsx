import clsx from 'clsx'
import Image from 'next/image'
import React from 'react'

const FallBackUserImage = ({ className }: { className?: string }) => {
	return (
		<Image
			className={clsx(className, 'rounded-full')}
			src='/images/default_avatar.png'
			alt='avatar'
			width={30}
			height={30}
		/>
	)
}

export default FallBackUserImage
