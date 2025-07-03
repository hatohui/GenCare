'use client'

import React, { useRef, useState, useMemo } from 'react'
import Typed, { TypedOptions } from 'typed.js'

const TypedText = ({
	className,
	...options
}: TypedOptions & { className?: string }) => {
	const el = useRef<HTMLSpanElement>(null)
	const [isFirstLoad, setIsFirstLoad] = useState(true)

	// Extract strings join for dependency
	const stringsKey = useMemo(
		() => (options.strings ? options.strings.join('') : ''),
		[options.strings]
	)

	// Memoize defaultOptions so it doesn't change on every render
	const defaultOptions: TypedOptions = useMemo(
		() => ({
			typeSpeed: 30,
			backSpeed: 25,
			showCursor: false,
			onDestroy: () => setIsFirstLoad(false),
			onComplete: () => setIsFirstLoad(false),
		}),
		[]
	)

	// Reset isFirstLoad when strings change
	React.useEffect(() => {
		setIsFirstLoad(true)
	}, [stringsKey])

	React.useEffect(() => {
		if (!el.current) return
		const typed = new Typed(el.current, { ...defaultOptions, ...options })

		return () => {
			typed.destroy()
		}
		// Only re-run when options or strings change
	}, [defaultOptions, stringsKey, options.typeSpeed, options.backSpeed])

	return isFirstLoad ? (
		<span className={className} ref={el} />
	) : (
		<span className={className}>
			{options.strings && options.strings.length > 0 ? options.strings[0] : ''}
		</span>
	)
}

export default TypedText
