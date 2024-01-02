export const formatSeconds = (seconds: number) => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	const second = seconds - hours * 3600 - minutes * 60
	return `${hours.toString().padStart(2)}:${minutes.toString().padStart(2)}:${second.toString().padStart(2)}`
}
