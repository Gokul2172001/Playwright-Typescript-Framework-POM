import { chromium } from "@playwright/test";
import { execFileSync } from "child_process";
import * as os from 'os';
import { execSync } from 'child_process';
import * as path from 'path';


const platform = os.platform();
const type = os.type();

export function getDeviceName() {

    let deviceName: string;

    switch (platform) {
        case 'win32':
            deviceName = 'Windows';
            break;
        case 'darwin':
            deviceName = 'macOS';
            break;
        case 'linux':
            deviceName = 'Linux';
            break;
        default:
            deviceName = 'Unknown';
    }
    if (type == null || type == undefined)
        return deviceName;
    else return type
}

export function getDeviceVersion() {
    return os.release();
}
export function getDevicePlatform() {
    return os.platform()
}

export function getIpAddress() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                return net.address;
            }
        }
    }
    return null;
}


function runGitCommand(command: string): string {
    try {
        return execSync(command, { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error(`Error running git command "${command}":`, error);
        return '';
    }
}
export function getGitRepoRoot(): string {
    return runGitCommand('git rev-parse --show-toplevel');
}
export function getGitRepoName(): string {
    const repoPath = getGitRepoRoot();
    return repoPath ? path.basename(repoPath) : '';
}

export function getGitBranchName(): string {
    return runGitCommand('git rev-parse --abbrev-ref HEAD');
}

export function getGitUserName(): string {
    return runGitCommand('git config user.name');
}

export function getGitUserEmail(): string {
    return runGitCommand('git config user.email');
}

export function formatDuration(start: Date | any, end: Date): string {
    const ms = end.getTime() - start.getTime();
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
    const milliseconds = ms % 1000;

    return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
}

