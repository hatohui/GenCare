const stimulateLoad = async (time: number) => {
	await new Promise(resolve => setTimeout(resolve, time))
}

export { stimulateLoad }
