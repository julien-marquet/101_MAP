export function msToTime(duration) {
	let	seconds = parseInt((duration / 1000) % 60, 10),
		minutes = parseInt((duration / (1000 * 60)) % 60, 10),
		hours = parseInt((duration / (1000 * 60 * 60)) % 24, 10);
	
	hours = (hours < 10) ? "0" + hours : hours;
	minutes = (minutes < 10) ? "0" + minutes : minutes;
	seconds = (seconds < 10) ? "0" + seconds : seconds;
	
	return hours + ":" + minutes + ":" + seconds;
}