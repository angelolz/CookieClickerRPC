# Cookie Clicker Rich Presence Creator
This Cookie Clicker mod will allow you to share your game stats with everyone on Discord!

## Requirements
- Windows (macOS and Linux support soon, maybe?)
- CCSE
- The Rich Presence Cookie Clicker mod
- The Rich Presence Java Client
- Java 11 (?)

## Installation (Steam)
1) Download CCSE [here](https://klattmose.github.io/CookieClicker/SteamMods/CCSE.zip?v=2.031) and add it to your mods folder (inside the local folder preferably).
2) Download the mod for Cookie Clicker [here](https://www.google.com/). Put it in the same folder as CCSE.
3) Download the Rich Presence application [here](https://www.google.com/). Put it somewhere easily accessible.
4) Launch the application first, before enabling the mod. Upon opening the application, you should see your own Discord name and tag.
5) Enable both **CCSE** and the **Discord Rich Presence** mods. *Note: if you are using Cookie Monster, make sure to load both aforementioned mods before Cookie Monster!*
6) You should be able to see your rich presence shown on Discord!

## Installation (Browser)
Copy this code and save it as a bookmark.
```javascript
javascript: (function () {   Game.LoadMod('https://angelolz.dev/mods/ccrpc/main.js'); }());
```

On your Cookie Clicker game, click the bookmark you created. If it asks you if you're sure that you want to load the mod, click **Yes**. *The only reason why it asks this is because the mod is based on the steam version, which is (currently) v1.042. This should still work on the current version that the browser is on now.* 

# Bugs/Feedback
There are times where I might've left a nasty bug in there, that's my bad! My JavaScript skills aren't the best, since I don't have a lot of experience with it. With that said, if you do spot a bug or have any issues, please [open an issue](https://github.com/angelolz1/CookieClickerRPC/issues)! 

# Dependencies Used:
- [Vatuu/discord-rpc](https://github.com/Vatuu/discord-rpc) for the Java implementation of Rich Presence
- [TooTallNate/Java-WebSocket](https://github.com/TooTallNate/Java-WebSocket) for the websocket server
- [google/Gson](https://github.com/google/gson) for JSON parsing
- [qos-ch/logback](https://github.com/qos-ch/logback) for logging (using logback-classic)

# Copyright
MIT

---
Cookie Clicker and its icons are owned by Orteil. Thank you Orteil for creating such an amazing game! 
