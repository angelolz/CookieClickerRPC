import fs from 'fs';
import path from 'path';

const configPath = path.join(__dirname, '../config.json');

export function getSavedVersion(): 'steam' | 'web' | null {
    if (!fs.existsSync(configPath)) return null;

    try {
        const raw = fs.readFileSync(configPath, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.version === 'steam' || parsed.version === 'web') {
            return parsed.version;
        }
    } catch (err) {
        console.error('Error reading config:', err);
    }

    return null;
}

export function saveVersion(version: 'steam' | 'web') {
    fs.writeFileSync(configPath, JSON.stringify({ version }, null, 2), 'utf-8');
}
