'use client'

import React, { useRef, useEffect } from 'react'
import Typed, { TypedOptions } from 'typed.js'

const TypedText = ({
	className,
	strings,
	typeSpeed = 30,
	backSpeed = 25,
	showCursor = false,
	onComplete,
	...otherOptions
}: TypedOptions & { className?: string }) => {
	const el = useRef<HTMLSpanElement>(null)

	useEffect(() => {
		if (!el.current || !strings) return

		const typed = new Typed(el.current, {
			strings,
			typeSpeed,
			backSpeed,
			showCursor,
			onComplete,
			...otherOptions,
		})

		return () => {
			typed.destroy()
		}
	}, [strings, typeSpeed, backSpeed, showCursor, onComplete, otherOptions])

	return <span className={className} ref={el} />
}

export default TypedText
