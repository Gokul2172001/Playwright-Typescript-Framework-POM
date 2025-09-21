import { LaunchOptions } from "@playwright/test"; 
export const browserOptions: LaunchOptions = {
	headless: false,
	slowMo: 200,
	args: [
        "--use-fake-ui-for-media-stream",
        "--use-fake-device-for-media-stream",
        "--no-sandbox", "--disable-gpu"
	],
	firefoxUserPrefs: {
        "media.navigator-streams.fake": true,
        "media-navigator.permission.disabled": true,
	},
}
