const MINUTE = 60_000;

export const minutesBetween = (from: string, to: number) =>
	Math.max(0, Math.floor((to - Date.parse(from)) / MINUTE));

export function stepTime(minutes: number): string {
	if (minutes < 60) return `${minutes}m`;
	return `${Math.floor(minutes / 60)}h${String(minutes % 60).padStart(2, '0')}`;
}

export function waitTime(minutes: number): string {
	if (minutes < 60) return `${minutes} min`;
	const rest = minutes % 60;
	return rest === 0 ? `${Math.floor(minutes / 60)} h` : `${Math.floor(minutes / 60)} h ${rest} min`;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function clock(at: string, now: number): string {
	const date = new Date(at);
	const today = new Date(now);
	const time = `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
	const sameDay =
		date.getFullYear() === today.getFullYear() &&
		date.getMonth() === today.getMonth() &&
		date.getDate() === today.getDate();
	return sameDay ? time : `${MONTHS[date.getMonth()]} ${date.getDate()}, ${time}`;
}
