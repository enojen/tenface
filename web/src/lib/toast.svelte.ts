/** One short message at a time, shown above everything for a moment. */
class Toast {
	text = $state('');
	shown = $state(0);
	private timer: ReturnType<typeof setTimeout> | undefined;

	show(text: string) {
		this.text = text;
		this.shown += 1;
		clearTimeout(this.timer);
		this.timer = setTimeout(() => (this.text = ''), 1800);
	}
}

export const toast = new Toast();
