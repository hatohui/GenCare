import { motion } from 'motion/react'
import React, { useState, useMemo, useEffect } from 'react'
import TypedText from '../TypedText'
import Image from 'next/image'
import AnimatedLink from '../MotionLink'
import FlorageBackground from './FlorageBackground'
import { usePathname } from 'next/navigation'

const LandingPart = () => {
	const [typing, setTyping] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setTyping(false)
	}, [pathname])

	const animateStyle = useMemo(
		() => ({
			initial: { x: -50, opacity: 0, filter: 'blur(8px)' },
			animate: { x: 0, opacity: 1, filter: 'blur(0px)' },
			transition: {
				type: 'spring',
				stiffness: 100,
				damping: 12,
				mass: 0.1,
				duration: 1.5,
			},
		}),
		[]
	)

	const buttonVariants = useMemo(
		() => ({
			initial: { x: -50, opacity: 0, filter: 'blur(8px)' },
			animate: {
				x: 0,
				opacity: 1,
				filter: 'blur(0px)',
				transition: {
					delay: 1.5,
					type: 'spring',
					stiffness: 100,
					damping: 12,
					mass: 0.1,
					duration: 1.5,
				},
			},
			hover: { scale: 1.05, transition: { duration: 0.2 } },
			tap: { scale: 0.95, transition: { duration: 0.2 } },
		}),
		[]
	)

	return (
		<div className='relative min-h-screen w-full overflow-hidden'>
			<section className='relative h-screen w-full grid xl:gap-5 grid-cols-1 lg:grid-cols-2'>
				{/* page */}
				<div className='backdrop-blur-md lg:backdrop-blur-none flex flex-col gap-2 pt-[20%] text-shadow-2xs lg:col-span-1 sm:px-[5%] lg:pl-[15%] md:px-[5%] xl:pl-[20%] xl:pr-[15%] 2xl:pt-[20%] 2xl:pr-[10%]'>
					<motion.h3
						className='font-semibold px-4 pb-0 text-secondary text-center lg:text-left'
						{...animateStyle}
					>
						<span className='ml-1'>DỊCH VỤ CHĂM SÓC SỨC KHỎE</span>
					</motion.h3>

					<motion.h1
						className='text-center lg:text-left p-4 text-4xl lg:text-5xl xl:text-6xl 2xl:text-6xl font-bold xl:font-extrabold'
						{...animateStyle}
					>
						{!typing ? (
							<>
								<TypedText
									typeSpeed={10}
									className='bg-gradient-to-r from-slate-950 to-main bg-clip-text text-transparent'
									strings={['Giải Pháp Y Tế Giới Tính, Dành Cho ']}
									onComplete={() => setTyping(true)}
								/>
								<span>&nbsp;</span>
							</>
						) : (
							<>
								<span className='bg-gradient-to-r from-slate-950 to-main bg-clip-text text-transparent'>
									Giải Pháp Y Tế Giới Tính, Dành Cho{' '}
								</span>
								<span className='bg-gradient-to-r text-stroke-[1px] from-secondary to-main bg-clip-text underline text-transparent'>
									Bạn!
								</span>
							</>
						)}
					</motion.h1>

					<motion.p
						className='text-[0.9rem] text-center lg:text-left text-shadow-2xs text-muted-foreground px-4 xl:pr-48'
						{...animateStyle}
						transition={{ delay: 1.5 }}
					>
						Hệ thống cơ sở y tế Gencare là cơ sở chuyên về chăm sóc sức khỏe
						giới tính hàng đầu tại Việt Nam.
					</motion.p>

					<AnimatedLink
						className='p-4 ml-4 mt-[5%] bg-gradient-to-r duration-200 from-accent to-accent/80 backdrop-blur-3xl max-w-md hover:from-accent/90 hover:to-accent text-general self-center lg:self-auto text-nowrap text-center min-w-1/2 rounded-full'
						href='/register'
						{...buttonVariants}
					>
						<span>Đăng kí ngay với chúng tôi</span>
					</AnimatedLink>

					<div className='md:col-span-1' />
				</div>
			</section>

			{/* Image */}
			<motion.div
				className='absolute bottom-0 overflow-hidden h-[100vh] select-none md:h-[100vh] lg:h-[100vh] right-0 -z-10 w-full md:w-[50%]'
				initial={{ x: -50, opacity: 0, filter: 'blur(8px)' }}
				animate={{ x: 0, opacity: 1, filter: 'blur(0px)' }}
				transition={{
					type: 'spring',
					stiffness: 100,
					damping: 12,
					mass: 0.1,
					duration: 1.5,
				}}
			>
				<Image
					height='1000'
					width='2000'
					src='/images/landingClipArt.png'
					alt='landing'
					className='object-contain h-full w-full max-w-full scale-100'
					priority
				/>
			</motion.div>
			<FlorageBackground />
			<object
				data='/svgs/landingBase.svg'
				className='absolute h-screen w-screen lg:w-auto top-0 right-0 -z-20 overflow-clip'
			/>
		</div>
	)
}

export default React.memo(LandingPart)
