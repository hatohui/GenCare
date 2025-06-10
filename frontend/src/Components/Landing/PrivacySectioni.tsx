'use client'

import { motion } from 'framer-motion'

export default function PrivacySection() {
	return (
		<section className='snap-start py-20 bg-gray-100 text-center'>
			<motion.h2
				initial={{ opacity: 0, y: 50 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6 }}
				className='text-4xl font-bold mb-12'
			>
				Chính Sách Bảo Mật
			</motion.h2>
			<p className='text-lg text-gray-700 max-w-2xl mx-auto'>
				Chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Tất cả thông tin bạn
				cung cấp được mã hóa và bảo mật tuyệt đối.
			</p>
		</section>
	)
}
