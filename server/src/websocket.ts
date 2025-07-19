import { WebSocketServer } from 'ws';
import { client, clearActivity, resetStartTime } from './discord';
import { updatePresence } from './presence';
import { VERSION } from './constants';

let outdatedVersionWarned = false;
let jsonParseErrorWarned = false;

export function startWebSocketServer() {
  const server = new WebSocketServer({ port: 6969 });

  server.on('connection', (ws) => {
    console.log('Opened a connection with Cookie Clicker.');
    resetStartTime();

    ws.on('message', (data) => {
      try {
        const res = JSON.parse(data.toString());
        console.log("valid json");

        if (!outdatedVersionWarned && res.version === `v${VERSION}`) {
          console.log("--------------------------------------------");
          console.log("This app is out of date. Please update:");
          console.log("https://github.com/angelolz1/CookieClickerRPC/releases");
          console.log("--------------------------------------------");
          outdatedVersionWarned = true;
        }

        updatePresence(res);

      } catch (err) {
        if (!jsonParseErrorWarned) {
          console.error('Failed to parse JSON:', err);
          console.log('Raw message:', data.toString());
          jsonParseErrorWarned = true;
        }
      }
    });

    ws.on('close', () => {
      console.log("Closed connection with Cookie Clicker and stopped Rich Presence status.");
      resetStartTime();
      clearActivity();
    });

    ws.on('error', (err) => {
      console.error('WebSocket error:', err);
    });
  });
}
