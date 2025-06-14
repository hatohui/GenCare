'use client'

import { GetServiceByPageResponse } from '@/Interfaces/Service/Schemas/service'
import { samplePayload, useServiceByPage } from '@/Services/service-services'
import { motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { ServiceCard } from './ServiceCard'

const ServiceList = () => {
	const [services, setServices] = useState<GetServiceByPageResponse>({
		payload: samplePayload,
		count: 0,
	})
	const { data: serviceData } = useServiceByPage(1, 6)

	console.log(serviceData)

	useEffect(() => {
		if (serviceData && serviceData?.payload) {
			setServices(serviceData)
		}
	}, [serviceData])

	return (
		<>
			{services.payload.map((item, index) => (
				<motion.div
					key={item.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						delay: index * 0.15,
						duration: 0.5,
					}}
					className=' rounded-[30px] p-2 duration-300'
				>
					<ServiceCard {...item} />
				</motion.div>
			))}
		</>
	)
}

export default ServiceList
