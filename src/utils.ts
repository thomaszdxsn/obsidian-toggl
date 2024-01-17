import { TimeEntry, Timer } from "./interfaces"

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


export const isSameTimer = ({ timer, entry }: { timer: Timer, entry: TimeEntry }) => {
	return timer.projectId === entry.project_id && timer.description === entry.description && timer.tagIds.join(",") === entry.tag_ids.join(",")
}