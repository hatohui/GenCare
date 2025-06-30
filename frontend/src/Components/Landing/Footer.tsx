'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '../Logo'

export default function FooterSection() {
	return (
		<footer className='bg-gradient-to-b from-main to-secondary text-white relative overflow-hidden'>
			{/* Background Pattern */}
			<div className='absolute z-0 inset-0  floragebackground' />

			<div className='relative z-10 max-w-7xl mx-auto px-6 py-16'>
				{/* Main Footer Content */}
				<div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12'>
					{/* Company Info */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='lg:col-span-2'
					>
						<div className='flex items-center mb-6'>
							<Logo className='w-12 h-12' />
							<h3 className='text-2xl font-bold text-white'>GenCare</h3>
						</div>
						<p className='text-gray-300 mb-6 leading-relaxed max-w-md'>
							Chúng tôi cam kết cung cấp dịch vụ chăm sóc sức khỏe chất lượng
							cao với đội ngũ chuyên gia giàu kinh nghiệm và công nghệ hiện đại.
						</p>
						<div className='flex space-x-4'>
							<motion.a
								whileHover={{ scale: 1.1, y: -2 }}
								href='#'
								className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
							>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
								</svg>
							</motion.a>
							<motion.a
								whileHover={{ scale: 1.1, y: -2 }}
								href='#'
								className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
							>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z' />
								</svg>
							</motion.a>
							<motion.a
								whileHover={{ scale: 1.1, y: -2 }}
								href='#'
								className='w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors'
							>
								<svg
									className='w-5 h-5'
									fill='currentColor'
									viewBox='0 0 24 24'
								>
									<path d='M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z' />
								</svg>
							</motion.a>
						</div>
					</motion.div>

					{/* Quick Links */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h4 className='text-lg font-semibold mb-6 text-white'>Dịch Vụ</h4>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/service'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Khám sức khỏe
								</Link>
							</li>
							<li>
								<Link
									href='/service'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Tư vấn dinh dưỡng
								</Link>
							</li>
							<li>
								<Link
									href='/service'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Chăm sóc thai kỳ
								</Link>
							</li>
							<li>
								<Link
									href='/service'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Khám phụ khoa
								</Link>
							</li>
						</ul>
					</motion.div>

					{/* Support */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						whileInView={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
					>
						<h4 className='text-lg font-semibold mb-6 text-white'>Hỗ Trợ</h4>
						<ul className='space-y-3'>
							<li>
								<Link
									href='/contact'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Liên hệ
								</Link>
							</li>
							<li>
								<Link
									href='/faq'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									FAQ
								</Link>
							</li>
							<li>
								<Link
									href='/privacy'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Bảo mật
								</Link>
							</li>
							<li>
								<Link
									href='/terms'
									className='text-gray-300 hover:text-white transition-colors flex items-center'
								>
									<span className='w-2 h-2 bg-accent rounded-full mr-3'></span>
									Điều khoản
								</Link>
							</li>
						</ul>
					</motion.div>
				</div>

				{/* Contact Info */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='bg-white/10 rounded-2xl p-8 mb-8 backdrop-blur-sm'
				>
					<div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
						<div className='flex items-center'>
							<div className='w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
									/>
								</svg>
							</div>
							<div>
								<p className='text-sm text-gray-300'>Điện thoại</p>
								<p className='font-semibold text-white'>+84 123 456 789</p>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
									/>
								</svg>
							</div>
							<div>
								<p className='text-sm text-gray-300'>Email</p>
								<p className='font-semibold text-white'>info@gencare.com</p>
							</div>
						</div>
						<div className='flex items-center'>
							<div className='w-12 h-12 bg-accent rounded-full flex items-center justify-center mr-4'>
								<svg
									className='w-6 h-6 text-white'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
									/>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth={2}
										d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
									/>
								</svg>
							</div>
							<div>
								<p className='text-sm text-gray-300'>Địa chỉ</p>
								<p className='font-semibold text-white'>Hà Nội, Việt Nam</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* Bottom Bar */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
					className='border-t border-white/20 pt-8 flex flex-col md:flex-row justify-between items-center'
				>
					<p className='text-gray-300 text-sm mb-4 md:mb-0'>
						&copy; 2025 GenCare. Tất cả quyền được bảo lưu.
					</p>
					<div className='flex items-center space-x-6 text-sm'>
						<Link
							href='/privacy'
							className='text-gray-300 hover:text-white transition-colors'
						>
							Chính sách bảo mật
						</Link>
						<Link
							href='/terms'
							className='text-gray-300 hover:text-white transition-colors'
						>
							Điều khoản sử dụng
						</Link>
						<Link
							href='/sitemap'
							className='text-gray-300 hover:text-white transition-colors'
						>
							Sitemap
						</Link>
					</div>
				</motion.div>
			</div>
		</footer>
	)
}
