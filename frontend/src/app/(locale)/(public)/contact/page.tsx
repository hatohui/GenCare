'use client'
import { useLocale } from '@/Hooks/useLocale'
import React, { useState } from 'react'

const ContactPage = () => {
	const { t } = useLocale()
	const [form, setForm] = useState({ name: '', email: '', message: '' })
	const [submitted, setSubmitted] = useState(false)
	const [loading, setLoading] = useState(false)

	const handleChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
	) => {
		setForm({ ...form, [e.target.name]: e.target.value })
	}

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		setLoading(true)
		setTimeout(() => {
			setLoading(false)
			setSubmitted(true)
		}, 1200)
	}

	return (
		<div className='min-h-screen bg-gradient-to-b from-gray-50 to-white flex flex-col items-center justify-center py-16 px-4'>
			<div className='w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 border border-gray-100'>
				<h1 className='text-3xl font-bold text-main mb-2 text-center'>
					{t('contact.title')}
				</h1>
				<p className='text-gray-600 mb-8 text-center'>
					{t('contact.subtitle')}
				</p>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
					{/* Contact Form */}
					<form onSubmit={handleSubmit} className='space-y-4'>
						<div>
							<label
								htmlFor='name'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								{t('contact.form.name')}
							</label>
							<input
								type='text'
								id='name'
								name='name'
								value={form.name}
								onChange={handleChange}
								className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:outline-none'
								placeholder={t('contact.form.name_placeholder')}
								required
							/>
						</div>
						<div>
							<label
								htmlFor='email'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								{t('contact.form.email')}
							</label>
							<input
								type='email'
								id='email'
								name='email'
								value={form.email}
								onChange={handleChange}
								className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:outline-none'
								placeholder={t('contact.form.email_placeholder')}
								required
							/>
						</div>
						<div>
							<label
								htmlFor='message'
								className='block text-sm font-medium text-gray-700 mb-1'
							>
								{t('contact.form.message')}
							</label>
							<textarea
								id='message'
								name='message'
								value={form.message}
								onChange={handleChange}
								className='w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-main focus:outline-none min-h-[100px]'
								placeholder={t('contact.form.message_placeholder')}
								required
							/>
						</div>
						<button
							type='submit'
							className='w-full py-2 px-4 bg-main text-white rounded-lg font-semibold hover:bg-main/90 transition disabled:opacity-60'
							disabled={loading}
						>
							{loading ? t('contact.form.sending') : t('contact.form.send')}
						</button>
						{submitted && (
							<div className='text-green-600 text-center font-medium mt-2'>
								{t('contact.form.success')}
							</div>
						)}
					</form>
					{/* Contact Info */}
					<div className='flex flex-col gap-4 justify-center'>
						<div className='flex items-center gap-3'>
							<span className='text-main font-bold'>
								{t('contact.info.address')}:
							</span>
							<span>TP HCM, Việt Nam</span>
						</div>
						<div className='flex items-center gap-3'>
							<span className='text-main font-bold'>
								{t('contact.info.phone')}:
							</span>
							<span>1900 1717</span>
						</div>
						<div className='flex items-center gap-3'>
							<span className='text-main font-bold'>
								{t('contact.info.email')}:
							</span>
							<span>support@gencare.vn</span>
						</div>
						<div className='mt-6 text-gray-500 text-sm'>
							{t('contact.info.note')}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default ContactPage
