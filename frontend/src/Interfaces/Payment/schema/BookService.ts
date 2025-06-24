import { z } from 'zod'

export const personSchema = z.object({
	firstName: z.string().min(1, 'Required'),
	lastName: z.string().min(1, 'Required'),
	phoneNumber: z.string().min(10, 'Invalid phone'),
	dateOfBirth: z.string().refine(val => !isNaN(Date.parse(val)), {
		message: 'Invalid date',
	}),
	gender: z.boolean(),
	serviceId: z.string().min(1),
})

export const formSchema = z.object({
	people: z.array(personSchema).min(1, 'At least one booking is required'),
})

export type FormSchema = z.infer<typeof formSchema>

export interface BookServiceFormProps {
	serviceId: string
}
