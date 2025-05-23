import { motion } from 'motion/react'
import React, { useState, useMemo } from 'react'
import TypedText from '../TypedText'
import Image from 'next/image'
import AnimatedLink from '../MotionLink'

const LandingPart = () => {
	const [typing, setTyping] = useState(false)

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

	const buttonVariants = {
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
	}

	return (
		<>
			<section className='relative h-screen w-full grid gap-5 grid-cols-1 lg:grid-cols-2'>
				{/* page */}
				<div className='lg:col-span-1 pl-[5%] md:pl-[15%] pt-[20%] flex flex-col gap-2 text-shadow-2xs xl:pr[15%] md:pr-[10%] 2xl::pr-[20%]'>
					<motion.p
						className='font-semibold p-4 pb-0 text-secondary text-center lg:text-left'
						{...animateStyle}
					>
						<span className='text-secondary'>- </span>
						DỊCH VỤ CHĂM SÓC SỨC KHỎE
					</motion.p>

					<motion.div
						className='text-center lg:text-left p-4 text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold xl:font-extrabold'
						{...animateStyle}
					>
						<TypedText
							typeSpeed={10}
							className='bg-gradient-to-r from-slate-950 to-main bg-clip-text text-transparent'
							strings={['Giải Pháp Y Tế Giới Tính, Dành Cho ']}
							onComplete={() => setTyping(true)}
						/>
						<span> </span>
						{typing && (
							<TypedText
								typeSpeed={10}
								className='bg-gradient-to-r from-secondary to-main bg-clip-text underline text-transparent'
								strings={[' Bạn!']}
							/>
						)}
					</motion.div>

					<motion.p
						className='text-lg text-center lg:text-left text-shadow-2xs text-muted-foreground px-4 lg:pr-48'
						{...animateStyle}
						transition={{ delay: 1.5 }}
					>
						Hệ thống cơ sở y tế Gencare là cơ sở chuyên về chăm sóc sức khỏe
						giới tính hàng đầu tại Việt Nam.
					</motion.p>

					<AnimatedLink
						className='p-4 ml-4 mt-[15%] bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent text-general self-center lg:self-auto text-center w-1/2 rounded-full'
						href='/register'
						children={'Đăng kí ngay với chúng tôi'}
						{...buttonVariants}
					/>

					<div className='md:col-span-1' />
				</div>
			</section>

			{/* Image */}
			<motion.div
				className='absolute bottom-0 overflow-hidden h-[50vh] select-none md:h-[60vh] lg:h-[74vh] right-0 -z-10 w-full md:w-[50%]'
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
					height='500'
					width='1000'
					src='/images/landingClipArt.png'
					alt='landing'
					className='object-contain h-full w-full max-w-full scale-100 md:scale-90 lg:scale-100'
					priority
				/>
			</motion.div>

			<div className='absolute florageBackground top-0 inset-0 opacity-65 -z-10' />

			{/* svg */}
			<svg
				className='absolute w-full h-screen top-0 right-0 -z-20 overflow-clip'
				viewBox='0 0 1506 947'
				preserveAspectRatio='xMinYMin slice'
				fill='none'
				xmlns='http://www.w3.org/2000/svg'
			>
				<path
					d='M980.001 179C1051.5 156.167 1067.5 1 1067.5 1H1505V946.5H2C2 946.5 104.193 823.833 202 786.5C314.556 743.538 396.76 826.223 510.5 786.5C583.311 761.071 630.076 740.272 674.5 677.5C717.456 616.802 705.5 495.5 705.5 495.5C705.5 495.5 690.085 332.654 750.001 261.5C811.466 188.508 908.501 201.833 980.001 179Z'
					fill='#067DAD'
					stroke='#067DAD'
				/>
			</svg>
		</>
	)
}

export default React.memo(LandingPart)
