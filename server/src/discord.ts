import { Client } from "minimal-discord-rpc";

export const client = new Client({ clientId: '895895624891895828' });

let startTime: number;

client.on('ready', () => {
  console.log("Started Discord Rich Presence instance.");
  console.log("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
  startTime = Date.now();
});

client.on('disconnected', () => {
  console.log('Disconnected from Discord');
});

client.on('error', (err) => {
  console.error('Error:', err);
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
