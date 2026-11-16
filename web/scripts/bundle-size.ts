import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';

const ROOT = 'build/_app/immutable';
const BUDGET_KB = { js: 90, css: 16 } as const;
type Kind = keyof typeof BUDGET_KB;

const files = readdirSync(ROOT, { recursive: true, encoding: 'utf8' }).map((path) =>
	join(ROOT, path)
);

const gzipKB = (kind: Kind) =>
	files
		.filter((path) => path.endsWith(`.${kind}`))
		.reduce((sum, path) => sum + gzipSync(readFileSync(path)).length, 0) / 1024;

const over = (Object.keys(BUDGET_KB) as Kind[]).filter((kind) => {
	const used = gzipKB(kind);
	console.log(`${kind}: ${used.toFixed(1)} KB gzip, budget ${BUDGET_KB[kind]} KB`);
	return used > BUDGET_KB[kind];
});

if (over.length > 0) {
	console.error(`Over the bundle budget: ${over.join(', ')}`);
	process.exit(1);
}
