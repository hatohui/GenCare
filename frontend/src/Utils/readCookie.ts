export const readCookie = (name: string) => {
	const value = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')
	return value ? value.pop() : null
}
