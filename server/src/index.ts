import { login } from './discord';
import { startWebSocketServer } from './websocket';
import { askCookieClickerVersion } from './setup';
import { exec } from 'child_process';

async function main() {
    const version = await askCookieClickerVersion();
    console.log(`[INFO] Using the ${version} version of Cookie Clicker.`);
    openCookieClickerVersion(version);
    login();
    startWebSocketServer();
}

function openCookieClickerVersion(version: string): void {
    const command =
        process.platform === 'win32'
            ? 'start'
            : process.platform === 'darwin'
              ? 'open'
              : 'xdg-open';
    if (version === 'steam') {
        exec(`${command} steam://launch/1454400`);
    } else {
        exec(`${command} https://orteil.dashnet.org/cookieclicker/`);
    }
}

main();
