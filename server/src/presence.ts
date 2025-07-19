import { ActivityType } from 'minimal-discord-rpc';
import { setActivity, getStartTime } from './discord';
import { Activity, CookieData } from './types';

let currentCycleMode = 0;
let cycleTask: any = null;

export function updatePresence(cookieData: CookieData) {
    const activity: Activity = {
        type: ActivityType.Playing,
        details: `${cookieData.cookies} cookies`,
        state: `${cookieData.cookiesPerSecond} per second`,
        assets: {
            large_image: 'icon',
            large_text: 'CookieClickerRPC by angelolz',
        },
        timestamps: {
            start: getStartTime(),
        },
    };

    let currentMode;
    if (cookieData.config.cycle) {
        currentMode = currentCycleMode;

        if (!cycleTask) {
            cycleTask = setInterval(() => incrementMode(), 10000);
        }
    } else {
        currentMode = cookieData.config.smallIconMode;

        if (cycleTask) {
            clearInterval(cycleTask);
            cycleTask = null;
        }
    }

    switch (currentMode) {
        case 0:
            activity.assets.small_image = 'legacy';
            activity.assets.small_text = `Prestige Lv. ${cookieData.prestigeLevel} with ${cookieData.resets} ascends`;
            break;
        case 1:
            if (cookieData.lumps === '-1') {
                activity.assets.small_image = 'normal';
                activity.assets.small_text = 'Not growing any sugar lumps';
            } else {
                activity.assets.small_image = cookieData.lumpStatus;
                activity.assets.small_text = `${cookieData.lumps} sugar lumps | Growing a ${cookieData.lumpStatus} lump`;
            }
            break;
        case 2:
            activity.assets.small_image = 'cursor';
            activity.assets.small_text = `${cookieData.clicks} clicks | ${cookieData.cookiesPerClick} cookies per click`;
            break;
        case 3:
            activity.assets.small_image = 'goldencookie';
            activity.assets.small_text = `${cookieData.goldenCookiesClicked} GCs clicked | ${cookieData.goldenCookiesMissed} GCs missed`;
            break;
        case 4:
            if (cookieData.season !== '') {
                activity.assets.small_image = cookieData.season;
                activity.assets.small_text = `${cookieData.seasonName} | ${cookieData.drops}`;
            }
            break;
        default:
            break;
    }

    setActivity(activity);
}

function incrementMode() {
    currentCycleMode = (currentCycleMode + 1) % 5;
}
