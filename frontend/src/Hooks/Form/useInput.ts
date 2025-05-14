'use client'
import { ChangeEvent, useState } from 'react'

export type InputType =
	| 'button'
	| 'checkbox'
	| 'color'
	| 'date'
	| 'datetime-local'
	| 'email'
	| 'file'
	| 'hidden'
	| 'image'
	| 'month'
	| 'number'
	| 'password'
	| 'radio'
	| 'range'
	| 'reset'
	| 'search'
	| 'submit'
	| 'tel'
	| 'text'
	| 'time'
	| 'url'
	| 'week'

const useInput = (
	initial: any,
	type: InputType
): {
	type: InputType
	value: typeof initial
	onChange: (event: ChangeEvent<HTMLInputElement>) => void
	reset: () => void
} => {
	const [value, setValue] = useState<typeof initial>(initial)

	const onChange = (event: ChangeEvent<HTMLInputElement>) => {
		setValue(event.target.value)
	}

	const reset = () => setValue(null)

	return { type, value, onChange, reset }
}

export default useInput
