'use client'
import ConsultantChat from '@/Components/Chat/ConsultantChat'
import { Stethoscope, Users, MessageSquare } from 'lucide-react'

const ConsultantSupportPage = () => {
	return (
		<div className='flex flex-col h-full bg-general'>
			<div className='w-full max-w-7xl mx-auto p-6 flex-1'>
				<div className='bg-white rounded-xl shadow-lg overflow-hidden h-full flex flex-col'>
					<div className='bg-gradient-to-r from-green-500 to-green-600 p-6 text-white'>
						<div className='flex items-center gap-3 mb-2'>
							<div className='bg-white/20 p-2 rounded-lg'>
								<Stethoscope className='w-6 h-6' />
							</div>
							<h1 className='text-2xl font-bold'>Patient Support Dashboard</h1>
						</div>
						<div className='flex items-center gap-6 text-sm opacity-90'>
							<div className='flex items-center gap-2'>
								<Users className='w-4 h-4' />
								<span>Manage Patient Conversations</span>
							</div>
							<div className='flex items-center gap-2'>
								<MessageSquare className='w-4 h-4' />
								<span>Provide Healthcare Support</span>
							</div>
						</div>
					</div>

					<div className='flex-1 p-6 overflow-hidden'>
						<ConsultantChat className='w-full h-full' />
					</div>
				</div>
			</div>
		</div>
	)
}

export default ConsultantSupportPage
