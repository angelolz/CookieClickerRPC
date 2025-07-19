import { login } from './discord';
import { startWebSocketServer } from './websocket';
import { askCookieClickerVersion } from './setup';
import open from 'open';

async function main() {
    const version = await askCookieClickerVersion();
    console.log(`Using the ${version} version of Cookie Clicker.`);
    openCookieClickerVersion(version);
    login();
    startWebSocketServer();
}

function openCookieClickerVersion(version: string): void {
    if (version === 'steam') {
        open('steam://launch/1454400');
    } else {
        open('https://orteil.dashnet.org/cookieclicker/');
    }
}

main();
