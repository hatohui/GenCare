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
			hover: {
				scale: 1.05,
				boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
				transition: {
					duration: 0.3,
					ease: 'easeOut',
				},
			},
			tap: { scale: 0.95, transition: { duration: 0.2 } },
		}),
		[]
	)

	return (
		<div className='relative min-h-screen w-full overflow-hidden'>
			<section className='relative h-screen w-full grid xl:gap-8 grid-cols-1 lg:grid-cols-2 pb-40'>
				{/* page */}
				<div className='backdrop-blur-md lg:backdrop-blur-none flex flex-col gap-6 pt-[20%] text-shadow-2xs lg:col-span-1 sm:px-[5%] lg:pl-[15%] md:px-[5%] xl:pl-[20%] xl:pr-[15%] 2xl:pt-[20%] 2xl:pr-[10%]'>
					<motion.h3
						className='font-semibold px-6 pb-2 text-secondary text-center lg:text-left text-lg tracking-wide'
						{...animateStyle}
					>
						<span className='ml-1 bg-gradient-to-r from-secondary to-main bg-clip-text text-transparent'>
							DỊCH VỤ CHĂM SÓC SỨC KHỎE
						</span>
					</motion.h3>

					<motion.h1
						className='text-center lg:text-left p-6 text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold xl:font-extrabold leading-tight'
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
								<span className='bg-gradient-to-r text-stroke-[1px] from-secondary to-main bg-clip-text underline text-transparent animate-pulse'>
									Bạn!
								</span>
							</>
						)}
					</motion.h1>

					<motion.p
						className='text-lg text-center lg:text-left text-shadow-2xs text-muted-foreground px-6 xl:pr-48 leading-relaxed'
						{...animateStyle}
						transition={{ delay: 1.5 }}
					>
						Hệ thống cơ sở y tế Gencare là cơ sở chuyên về chăm sóc sức khỏe
						giới tính hàng đầu tại Việt Nam.
					</motion.p>

					<div className='flex justify-center lg:justify-start w-full mt-8 mb-16'>
						<AnimatedLink
							className='px-8 py-5 bg-gradient-to-r from-accent to-accent/80 border-2 border-white/60 shadow-2xl hover:shadow-[0_0_32px_8px_rgba(16,185,129,0.25)] hover:border-accent/80 focus:outline-none focus:ring-4 focus:ring-accent/30 rounded-full font-bold text-lg text-white transition-all duration-300 flex items-center gap-3 backdrop-blur-xl hover:scale-105 active:scale-95'
							href='/register'
							style={{ zIndex: 10 }}
							{...buttonVariants}
						>
							<span>Đăng kí ngay với chúng tôi</span>
							<svg
								className='w-5 h-5'
								fill='none'
								stroke='currentColor'
								viewBox='0 0 24 24'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M13 7l5 5m0 0l-5 5m5-5H6'
								/>
							</svg>
						</AnimatedLink>
					</div>

					<div className='md:col-span-1' />
				</div>
			</section>

			{/* Image */}
			<motion.div
				className='absolute top-1/2 transform -translate-y-1/2 overflow-hidden h-[100vh] select-none md:h-[100vh] lg:h-[100vh] right-0 -z-10 w-full md:w-[50%] flex items-center justify-center'
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
				<motion.div
					animate={{
						y: [0, -10, 0],
					}}
					transition={{
						duration: 6,
						repeat: Infinity,
						ease: 'easeInOut',
					}}
					className='flex items-center justify-center'
				>
					<Image
						height='1000'
						width='2000'
						src='/images/landingClipArt.png'
						alt='landing'
						className='object-contain h-full w-full max-w-full scale-100 drop-shadow-2xl'
						priority
					/>
				</motion.div>
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
