'use client'

import { create } from 'zustand'
import { Consultant } from '@/Interfaces/Account/Types/Consultant'

type ConsultantStore = {
	consultants: Consultant[]
	setConsultants: (consultants: Consultant[]) => void
}

export const useConsultantStore = create<ConsultantStore>(set => ({
	consultants: [],
	setConsultants: (consultants: Consultant[]) => set({ consultants }),
}))
