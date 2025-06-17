'use client'
import { useServiceById } from '@/Services/service-services'
import { useParams } from 'next/navigation'
import React from 'react'

const ServiceDetailPage = () => {
	const { id } = useParams()

	const { data, isError, isFetching } = useServiceById(id ? id.toString() : '')

	if (isFetching) return <div>Loading...</div>
	if (isError) return <div>Error</div>

	return <div>current id: {data?.name}</div>
}

export default ServiceDetailPage
