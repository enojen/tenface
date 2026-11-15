import { type AfterNavigate, goto } from '$app/navigation';

export const NavigationKind = { Enter: 'enter', Popstate: 'popstate' } as const;

let stack: string[] = [];
let replacing = false;
let ownBack = false;

const key = (url: URL) => url.pathname + url.search;

const replaceTop = (url: string) => {
	stack[Math.max(0, stack.length - 1)] = url;
};

const goBackBy = (steps: number, url: string) => {
	stack = stack.slice(0, Math.max(1, stack.length - steps));
	replaceTop(url);
};

const stepsBack = (navigation: AfterNavigate) =>
	navigation.type === NavigationKind.Popstate ? -(navigation.delta ?? -1) : 0;

export function track(navigation: AfterNavigate) {
	if (!navigation.to) return;
	const url = key(navigation.to.url);
	if (navigation.type === NavigationKind.Enter) {
		stack = [url];
		replacing = false;
	} else if (replacing) {
		replaceTop(url);
		replacing = false;
	} else if (stepsBack(navigation) > 0) {
		goBackBy(stepsBack(navigation), url);
	} else {
		stack.push(url);
	}
}

export function back(target: string) {
	if (stack.length >= 2 && stack[stack.length - 2] === target) {
		ownBack = true;
		history.back();
		return;
	}
	replacing = true;
	goto(target, { replace: true });
}

const canAnimate = () =>
	Boolean(document.startViewTransition) && !matchMedia('(prefers-reduced-motion: reduce)').matches;

const depth = (url: URL) => url.pathname.split('/').filter(Boolean).length;

export function slide(
	from: URL | undefined,
	to: URL | undefined,
	popstate: boolean,
	delta?: number
) {
	const mine = ownBack;
	ownBack = false;
	if (popstate && !mine) return null;
	if (!from || !to || from.pathname === to.pathname || !canAnimate()) return null;
	const backward = (delta ?? 0) < 0 || depth(to) < depth(from);
	document.documentElement.dataset.slide = backward ? 'back' : 'forward';
	return backward;
}
