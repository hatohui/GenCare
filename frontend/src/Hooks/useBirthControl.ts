import { BirthControlDates } from '@/Interfaces/BirthControl/Types/BirthControl'
import { create } from 'zustand'

type BirthControl = {
	birthControl: BirthControlDates | null
	setBirthControl: (value: BirthControlDates) => void
}

export const useBirthControl = create<BirthControl>(set => ({
	birthControl: null,
	setBirthControl: (value: BirthControlDates) => set({ birthControl: value }),
}))
