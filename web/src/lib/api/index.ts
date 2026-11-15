import { createMockApi } from './mock.ts';
import { createStreamApi } from './stream.ts';
import type { Api } from './types.ts';

const stream = import.meta.env.VITE_TENFACE_STREAM as string | undefined;

export const api: Api = stream ? createStreamApi(stream) : createMockApi();
