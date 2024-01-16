export const formatSeconds = (seconds: number) => {
	const hours = Math.floor(seconds / 3600)
	const minutes = Math.floor((seconds - hours * 3600) / 60)
	const second = seconds - hours * 3600 - minutes * 60
	return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${second.toString().padStart(2, "0")}`
}


export const nowPercentageInDay = () => {
	const now = new Date()
	const secondsInDay = 24 * 60 * 60
	const seconds = now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds()
	return Number((seconds / secondsInDay).toFixed(2))
}