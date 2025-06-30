'use client'

import React, { createContext, useContext, useState } from 'react'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'

type ConsultantContextType = {
	consultants: Consultant[]
	setConsultants: (consultants: Consultant[]) => void
}

const ConsultantContext = createContext<ConsultantContextType | undefined>(
	undefined
)

export const ConsultantProvider = ({
	children,
}: {
	children: React.ReactNode
}) => {
	const [consultants, setConsultants] = useState<Consultant[]>([])
	return (
		<ConsultantContext.Provider value={{ consultants, setConsultants }}>
			{children}
		</ConsultantContext.Provider>
	)
}

export const useConsultantContext = () => {
	const ctx = useContext(ConsultantContext)
	if (!ctx)
		throw new Error(
			'useConsultantContext must be used within ConsultantProvider'
		)
	return ctx
}
