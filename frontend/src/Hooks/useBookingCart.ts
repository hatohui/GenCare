import { create } from 'zustand'

type BookingCart = {
	services: { id: string; name: string; price: number }[]
	addService: (service: { id: string; name: string; price: number }) => void
	removeService: (serviceId: string) => void
	clearCart: () => void
}

export const useBookingCart = create<BookingCart>(set => ({
	services: [],
	addService: service =>
		set(state => ({
			services: [...state.services, service],
		})),
	removeService: serviceId =>
		set(state => ({
			services: state.services.filter(service => service.id !== serviceId),
		})),
	clearCart: () => set({ services: [] }),
}))
export const useBookingCartStore = useBookingCart
