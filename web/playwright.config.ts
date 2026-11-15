import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	webServer: [
		{
			command: 'pnpm build && pnpm preview --port 4173 --strictPort',
			port: 4173,
			reuseExistingServer: !process.env.CI
		},
		{
			command: 'pnpm dev --port 4175 --strictPort',
			env: { VITE_TENFACE_STREAM: '/stream' },
			port: 4175,
			reuseExistingServer: !process.env.CI
		}
	],
	use: { baseURL: 'http://localhost:4173' },
	projects: [{ name: 'phone', use: { ...devices['iPhone 14'] } }]
});
