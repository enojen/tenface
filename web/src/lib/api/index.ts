import { createMockApi } from './mock.ts';
import { createRemoteApi } from './remote.ts';
import type { Api } from './types.ts';

const server = import.meta.env.VITE_TENFACE_SERVER as string | undefined;

export const api: Api = server ? createRemoteApi(server) : createMockApi();
