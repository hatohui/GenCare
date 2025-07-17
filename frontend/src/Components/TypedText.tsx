'use client'

import React, { useRef, useState, useMemo, useEffect } from 'react'
import Typed, { TypedOptions } from 'typed.js'

const TypedText = ({
	className,
	...options
}: TypedOptions & { className?: string }) => {
	const el = useRef<HTMLSpanElement>(null)
	const [isFirstLoad, setIsFirstLoad] = useState(true)
	const [isClient, setIsClient] = useState(false)

	useEffect(() => {
		setIsClient(true)
	}, [])

	// Extract strings join for dependency
	const stringsKey = useMemo(
		() => (options.strings ? options.strings.join('') : ''),
		[options.strings]
	)

	// Reset isFirstLoad when strings change
	useEffect(() => {
		if (isClient) {
			setIsFirstLoad(true)
		}
	}, [stringsKey, isClient])

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

	useEffect(() => {
		if (!el.current || !isClient) return

		const typed = new Typed(el.current, { ...defaultOptions, ...options })

		return () => {
			typed.destroy()
		}
	}, [defaultOptions, options, isClient])

	// Show a static version of the text during server rendering or initial client hydration
	// Once on the client, we'll replace it with the animated version if needed
	return !isClient ? (
		<span className={className}>
			{options.strings && options.strings.length > 0 ? options.strings[0] : ''}
		</span>
	) : isFirstLoad ? (
		<span className={className} ref={el} />
	) : (
		<span className={className}>
			{options.strings && options.strings.length > 0 ? options.strings[0] : ''}
		</span>
	)
}

export default TypedText
