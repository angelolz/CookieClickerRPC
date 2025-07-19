import readline from 'readline';
import { getSavedVersion, saveVersion } from './config';

function createInterface() {
    return readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
}

function askYesNo(question: string): Promise<boolean> {
    const rl = createInterface();
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            const trimmed = answer.trim().toLowerCase();
            if (trimmed === 'yes' || trimmed === 'y') {
                resolve(true);
            } else if (trimmed === 'no' || trimmed === 'n') {
                resolve(false);
            } else {
                console.log("Please enter 'yes' or 'no'.");
                askYesNo(question).then(resolve);
            }
        });
    });
}

export async function askCookieClickerVersion(): Promise<string> {
    const saved = getSavedVersion();
    if (saved) {
        console.log(`Detected previously selected version: ${saved}`);
        return saved;
    }

    const isSteam = await askYesNo(
        'Are you playing the Steam version of Cookie Clicker? (yes/no): '
    );
    const version = isSteam ? 'steam' : 'web';

    console.log(`Saving preference: ${version}`);
    saveVersion(version);
    return version;
}
