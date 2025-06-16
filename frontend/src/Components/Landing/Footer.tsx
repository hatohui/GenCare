'use client'

import { motion } from 'motion/react'
import Link from 'next/link'

export default function FooterSection() {
	return (
		<footer className='py-12 bg-gradient-to-b from-main to-secondary text-gray-400 text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-2xl font-bold mb-8 text-white'
			>
				Liên Hệ và Chính Sách Bảo Mật
			</motion.h2>
			<div className='text-lg text-general max-w-2xl mx-auto mb-8'>
				<p className='mb-4'>
					Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Tất cả thông tin bạn
					cung cấp được mã hóa và bảo mật tuyệt đối.
				</p>
				<p className='mb-4'>
					Để biết thêm chi tiết, vui lòng tham khảo{' '}
					<a href='/privacy' className='text-pink-500 hover:underline'>
						Chính Sách Bảo Mật
					</a>
					.
				</p>
			</div>

			<div className='flex justify-center gap-5 mb-8'>
				<a href='/contact' className='text-gray-300 hover:text-white'>
					Liên Hệ
				</a>
				<a href='/terms' className='text-gray-300 hover:text-white'>
					Điều Khoản Sử Dụng
				</a>
				<a href='/faq' className='text-gray-300 hover:text-white'>
					Câu Hỏi Thường Gặp
				</a>
			</div>

			<div className='text-sm text-gray-400'>
				<p>&copy; 2025 GenCare. All rights reserved.</p>

				<div className='mt-2'>
					<Link href='#' className='text-gray-300 hover:text-white'>
						Facebook
					</Link>
					<span className='mx-2'>|</span>
					<Link href='#' className='text-gray-300 hover:text-white'>
						Instagram
					</Link>
					<span className='mx-2'>|</span>
					<Link href='#' className='text-gray-300 hover:text-white'>
						Twitter
					</Link>
				</div>
			</div>
		</footer>
	)
}
