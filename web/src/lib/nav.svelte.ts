import { type AfterNavigate, goto } from '$app/navigation';

export const NavigationKind = { Enter: 'enter', Popstate: 'popstate' } as const;

const stack: string[] = [];
let replacing = false;
let ownBack = false;

const key = (url: URL) => url.pathname + url.search;

export function track(navigation: AfterNavigate) {
	if (!navigation.to) return;
	const url = key(navigation.to.url);
	if (replacing || navigation.type === NavigationKind.Enter) {
		if (navigation.type === NavigationKind.Enter) stack.length = 0;
		stack[Math.max(0, stack.length - 1)] = url;
		replacing = false;
	} else if (navigation.type === NavigationKind.Popstate && (navigation.delta ?? -1) < 0) {
		stack.splice(Math.max(1, stack.length + (navigation.delta ?? -1)));
		stack[stack.length - 1] = url;
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
	if (!from || !to || from.pathname === to.pathname) return null;
	if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches)
		return null;
	const backward = (delta ?? 0) < 0 || depth(to) < depth(from);
	document.documentElement.dataset.slide = backward ? 'back' : 'forward';
	return backward;
}
