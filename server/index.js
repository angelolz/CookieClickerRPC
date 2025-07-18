import { DiscordRPCClient, ActivityPresets, ButtonTemplates, DiscordRPCManager } from '@ryuziii/discord-rpc';

const client = new DiscordRPCClient({ clientId: '895895624891895828', transport: 'ipc' });
import { WebSocketServer } from 'ws';
const version = "2.0.0";
var outdatedVersionWarned = false;
var jsonParseErrorWarned = false;
var startTime;
client.on('ready', () => {
  console.log("Started Discord Rich Presence instance.");
  console.log("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
  startTime = Date.now() / 1000;
});

client.on('disconnected', () => {
    console.log('Disconnected from Discord');
});
client.on('error', (err) => {
    console.error('Error:', err);
});

client.connect();

const server = new WebSocketServer({ port: 6969 });

server.on('connection', (ws) => {
    //TODO: overlay ting
    // if(conn.getResourceDescriptor().equals("/ws"))
    //     overlayWebSocket = conn;

    console.log('Opened a connection with Cookie Clicker.');
    startTime = Date.now() / 1000;

    ws.on('message', (data) => {
        try {
            const res = JSON.parse(data);
            console.log("valid json");
            if(!outdatedVersionWarned && res.version === `v${version}`) {
                console.log("--------------------------------------------");
                console.log("This app is out of date. Please update to the new version by visiting");
                console.log("https://github.com/angelolz1/CookieClickerRPC/releases");
                console.log("--------------------------------------------");
    
                outdatedVersionWarned = true;
            }
    
            updatePresence(res);
    
            //TODO this
            // if(overlayWebSocket != null)
            //     overlayWebSocket.send(text);
        } catch (err) {
            if(!jsonParseErrorWarned) {
                console.error('Failed to parse JSON:', err);
                console.log('Raw message:', data.toString());
                jsonParseErrorWarned = true;
            }
        }
    });

    ws.on('close', () => {

        //TODO
        // if(conn.getResourceDescriptor().equals("/ws"))
        //     overlayWebSocket = null;
    
        console.log("Closed connection with Cookie Clicker and stopped Rich Presence status.");
        startTime = Date.now() / 1000;
        client.clearActivity();
    });
    
    ws.on('error', (err) => {
        console.error('WebSocket error:', err);
    });
});

function updatePresence(cookieData) {

    var activity = {
        details: cookieData.cookies + " cookies",
        state: cookieData.cookiesPerSecond + " per second",
        largeImageKey: 'icon',
        largeImageText: 'CookieClickerRPC by angelolz',
        // smallImageKey: "https://cdn.discordapp.com/attachments/1237274560215253012/1395703221552414730/image.png?ex=687b696a&is=687a17ea&hm=08f2a9d78f5904e39f21ed2e9e3428150742b328d6597f0dffa5c8c8962a1184&",
        // smallImageText: `Prestige Lv. ${cookieData.prestigeLevel} with ${cookieData.resets} ascends`,
        startTimestamp: startTime
    };

    if(cookieData.config.showElapsedTime === "1")
        activity.startTimestamp = startTime;

    switch(cookieData.config.smallIconMode)   
    {
        case 0:
            console.log("legacy");
            activity.smallImageKey = "legacy";
            activity.smallImageText = `Prestige Lv. ${cookieData.prestigeLevel} with ${cookieData.resets} ascends`;
            break;
        case 1:
            if(cookieData.lumps === "-1")
            {
                activity.smallImageKey = "normal";
                activity.smallImageText = "Not growing any sugar lumps";
            }

            else
            {
                activity.smallImageKey = cookieData.lumpStatus;
                activity.smallImageText = `${cookieData.lump} sugar lumps | Growing a ${cookieData.lumpStatus} lump`;
            }
            break;
        case 2:
            activity.smallImageKey = "cursor";
            activity.smallImageText = `${cookieData.clicks} clicks | ${cookiesPerClick} cookies per click`;
            break;
        case 3:
            activity.smallImageKey = "goldencookie";
            activity.smallImageText = `${cookieData.goldenCookiesClicked} GCs clicked | ${cookieData.goldenCookiesMissed} GCs missed`;
            break;
        case 4:
            if(!cookieData.season === "")
            {
                activity.smallImageKey = cookieData.season;
                activity.smallImageText = `${cookieData.seasonName} | ${cookieData.drops}`;
            }
            break;
        default:
            break;
    }

    console.log(activity);
    client.setActivity(activity);
}