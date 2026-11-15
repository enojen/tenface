export const ToastMark = { Done: 'done', Failed: 'failed' } as const;
export type ToastMark = (typeof ToastMark)[keyof typeof ToastMark];

class Toast {
	text = $state('');
	mark = $state<ToastMark>(ToastMark.Done);
	shown = $state(0);
	private timer: ReturnType<typeof setTimeout> | undefined;

	show(text: string, mark: ToastMark = ToastMark.Done) {
		this.text = text;
		this.mark = mark;
		this.shown += 1;
		clearTimeout(this.timer);
		this.timer = setTimeout(() => (this.text = ''), 1800);
	}
}

export const toast = new Toast();
