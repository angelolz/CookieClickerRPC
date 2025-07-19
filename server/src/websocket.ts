import { WebSocketServer } from 'ws';
import { client, clearActivity, resetStartTime } from './discord';
import { updatePresence } from './presence';
import { VERSION } from './constants';

let outdatedVersionWarned = false;
let jsonParseErrorWarned = false;

export function startWebSocketServer() {
    const server = new WebSocketServer({ port: 6969 });

    server.on('connection', (ws) => {
        console.log('[INFO] Opened a connection with Cookie Clicker.');
        resetStartTime();

        ws.on('message', (data) => {
            try {
                const res = JSON.parse(data.toString());

                if (!outdatedVersionWarned && res.version !== `v${VERSION}`) {
                    console.log(
                        '[WARN] !------------------------------------------!'
                    );
                    console.log(
                        `[WARN] This app is out of date. Current: v${VERSION} | Latest: ${res.version}`
                    );
                    console.log(
                        '[WARN] Please update here: https://github.com/angelolz1/CookieClickerRPC/releases'
                    );
                    console.log(
                        '[WARN] !------------------------------------------!'
                    );
                    outdatedVersionWarned = true;
                }

                updatePresence(res);
            } catch (err) {
                if (!jsonParseErrorWarned) {
                    console.error(
                        '!!!!! ERROR: Failed to process message. Please report the following error to the developer: !!!!!\n',
                        err
                    );
                    console.log('\nRaw message:', data.toString());
                    jsonParseErrorWarned = true;
                }
            }
        });

        ws.on('close', () => {
            console.log(
                '[INFO] Closed connection with Cookie Clicker and stopped Rich Presence status.'
            );
            outdatedVersionWarned = false;
            jsonParseErrorWarned = false;
            resetStartTime();
            clearActivity();
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
        });
    });
}
