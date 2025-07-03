import { z } from 'zod'
import {
	parseISO,
	isValid,
	differenceInYears,
	isBefore,
	isAfter,
} from 'date-fns'

// Vietnamese phone number regex (supports formats like 0912345678, +84912345678, 0912-345-678)
const vietnamesePhoneRegex = /^(\+84|84|0)[3|5|7|8|9][0-9]{8}$/

export const personSchema = z.object({
	firstName: z.string().min(1, 'Tên không được để trống'),
	lastName: z.string().min(1, 'Họ không được để trống'),
	phoneNumber: z
		.string()
		.min(10, 'Số điện thoại phải có ít nhất 10 ký tự')
		.regex(vietnamesePhoneRegex, 'Số điện thoại không đúng định dạng Việt Nam'),
	dateOfBirth: z
		.string()
		.refine(
			val => {
				const date = parseISO(val)
				return isValid(date)
			},
			{
				message: 'Ngày sinh không hợp lệ',
			}
		)
		.refine(
			val => {
				const birthDate = parseISO(val)
				if (!isValid(birthDate)) return false
				const age = differenceInYears(new Date(), birthDate)
				return age >= 0 && age <= 120
			},
			{
				message: 'Ngày sinh phải hợp lý (0-120 tuổi)',
			}
		)
		.refine(
			val => {
				const birthDate = parseISO(val)
				if (!isValid(birthDate)) return false
				return (
					isBefore(birthDate, new Date()) || !isAfter(birthDate, new Date())
				)
			},
			{
				message: 'Ngày sinh không thể trong tương lai',
			}
		),
	gender: z.boolean(),
	serviceId: z.string().min(1, 'Dịch vụ không được để trống'),
})

export const formSchema = z.object({
	people: z.array(personSchema).min(1, 'Cần ít nhất một người đặt dịch vụ'),
})

export type FormSchema = z.infer<typeof formSchema>

export interface BookServiceFormProps {
	serviceId: string
}
