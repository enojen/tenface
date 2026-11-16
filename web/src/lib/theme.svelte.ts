export const Theme = { Light: 'light', Dark: 'dark' } as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

const KEY = 'tenface-theme';

export const GROUND: Record<Theme, string> = {
	[Theme.Light]: '#e7e1d4',
	[Theme.Dark]: '#2a2620'
};

function saved(): Theme {
	try {
		return localStorage.getItem(KEY) === Theme.Dark ? Theme.Dark : Theme.Light;
	} catch {
		return Theme.Light;
	}
}

function save(value: Theme) {
	try {
		localStorage.setItem(KEY, value);
	} catch {}
}

class ThemeChoice {
	value = $state<Theme>(Theme.Light);

	start() {
		this.value = saved();
		document.documentElement.dataset.theme = this.value;
	}

	toggle() {
		this.value = this.value === Theme.Dark ? Theme.Light : Theme.Dark;
		document.documentElement.dataset.theme = this.value;
		save(this.value);
	}
}

export const theme = new ThemeChoice();
