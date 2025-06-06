export function debounce<T extends (...args: any[]) => void>(
	callback: T,
	delay: number
) {
	let timeoutId: ReturnType<typeof setTimeout>

	return function (...args: Parameters<T>) {
		clearTimeout(timeoutId)
		timeoutId = setTimeout(() => {
			callback(...args)
		}, delay)
	}
}
