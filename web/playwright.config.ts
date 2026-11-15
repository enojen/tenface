import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	webServer: {
		command: 'pnpm build && pnpm preview --port 4173 --strictPort',
		port: 4173,
		reuseExistingServer: !process.env.CI
	},
	use: { baseURL: 'http://localhost:4173' },
	projects: [
		// The owner uses an iPhone, so the phone runs in WebKit, the engine of Safari.
		{ name: 'phone', use: { ...devices['iPhone 14'] } }
	]
});
