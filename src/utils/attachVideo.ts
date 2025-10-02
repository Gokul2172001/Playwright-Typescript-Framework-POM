import * as fs from 'fs';
import * as path from 'path';
import { ICustomWorld } from '../config/custom-world';

export async function attachVideo(this: ICustomWorld, testPassed: boolean) {
    const video = this.page?.video();
    if (!video) return;

    // Get original video path
    const originalVideoPath = await video.path();

    // Wait for video file to be written before reading
    await waitForFile(originalVideoPath, 3000);

    if (!fs.existsSync(originalVideoPath)) {
        console.warn(`⚠️ Video file not found: ${originalVideoPath}`);
        return;
    }

    if (testPassed) {
        // Delete video if test passed to save space
        fs.unlinkSync(originalVideoPath);
        return;
    }

    // Read video file as binary buffer
    const videoBuffer = fs.readFileSync(originalVideoPath);

    // Convert to base64 string
    const base64Video = videoBuffer.toString('base64');

    // Prepare inline base64 video src
    const videoHtml = `<video controls style="max-width: 100%; max-height: 600px;">
	<source src="data:video/webm;base64,${base64Video}" type="video/webm" />
	Your browser does not support the video tag.
  </video>`;

    // Attach the video HTML (base64 embedded)
    await this.attach(videoHtml, 'text/html');

    // Optionally delete the video file after attaching (to save disk space)
    fs.unlinkSync(originalVideoPath);
}

// Wait for file to exist helper
async function waitForFile(filePath: string, timeoutMs = 3000): Promise<void> {
    const start = Date.now();
    while (!fs.existsSync(filePath)) {
        if (Date.now() - start > timeoutMs) break;
        await new Promise((res) => setTimeout(res, 100));
    }
}
