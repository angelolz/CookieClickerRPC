import { Client } from 'minimal-discord-rpc';
import { CLIENT_ID } from './constants';

export const client = new Client({ clientId: CLIENT_ID });

let startTime: number;

client.on('ready', () => {
    console.log('[INFO] Started Discord Rich Presence instance.');
    console.log(
        '[INFO] Your Rich Presence will show once the Cookie Clicker mod is loaded.'
    );
    startTime = Date.now();
});

client.on('disconnected', () => {
    console.log('[WARN] Disconnected from Discord');
});

client.on('error', (err) => {
    console.error('[ERROR] Error:', err);
});

export function getStartTime(): number {
    return startTime;
}

export function resetStartTime() {
    startTime = Date.now();
}

export function login() {
    client.login();
}

export function clearActivity() {
    client.clearActivity();
}

export function setActivity(activity: any) {
    client.setActivity(activity);
}
