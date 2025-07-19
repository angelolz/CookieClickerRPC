import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
declare global {
    namespace NodeJS {
        interface Process {
            pkg?: {
                entrypoint: string;
                defaultEntrypoint: string;
            };
        }
    }
}

const exeDir = process.pkg ? dirname(process.execPath) : __dirname;
const configPath = path.join(exeDir, 'config.json');

export function getSavedVersion(): string | null {
    if (!fs.existsSync(configPath)) return null;

    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        return parsed.version;
    } catch (err) {
        console.error('Error reading config:', err);
    }

    return null;
}

export function saveVersion(version: string) {
    fs.writeFileSync(configPath, JSON.stringify({ version }, null, 2), 'utf-8');
    console.log('Saved settings to: ', configPath);
}
