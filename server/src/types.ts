import { ActivityType } from 'minimal-discord-rpc';

interface ActivityAssets {
    large_image?: string;
    large_text?: string;
    small_image?: string;
    small_text?: string;
}

interface ActivityTimestamps {
    start?: number;
    end?: number;
}

export interface Activity {
    type: ActivityType;
    details: string;
    state: string;
    assets: ActivityAssets;
    timestamps?: ActivityTimestamps;
}

export interface CookieData {
    version: string;
    cookies: string;
    cookiesPerSecond: string;
    prestigeLevel: number;
    resets: number;
    lumps: string;
    lump: number;
    lumpStatus: string;
    clicks: number;
    cookiesPerClick: string;
    goldenCookiesClicked: number;
    goldenCookiesMissed: number;
    season: string;
    seasonName: string;
    drops: string;
    config: {
        smallIconMode: number;
        cycle: boolean;
    };
}
