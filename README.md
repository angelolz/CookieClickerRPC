# Cookie Clicker Rich Presence Creator
This Cookie Clicker mod will allow you to share your game stats with everyone on Discord!

## Requirements
- CCSE
- The Rich Presence Cookie Clicker mod
- The Rich Presence Java Client
- Java 8 or higher

## Mod Installation (Steam) (Windows only)
1) Download CCSE [here](https://klattmose.github.io/CookieClicker/SteamMods/CCSE.zip?v=2.031) and add it to your mods folder (inside either the local or workshop folder).  
   ![Put CCSE in your mods folder](https://i.imgur.com/nIweduY.png)
   
2) Download the mod for Cookie Clicker [here](https://github.com/angelolz1/CookieClickerRPC/releases). Put it in the same folder as CCSE.  
   ![Put the Cookie Clicker Rich Presence mod in the same folder](https://i.imgur.com/8xljqfU.png)
   
3) In Cookie Clicker, enable both **CCSE** and **Discord Rich Presence** then click **Restart with new changes**.  
   *Note: if you're using Cookie Monster, make sure to prioritize it after those two mods.*
   ![Enable both mods!](https://i.imgur.com/MPEgYTJ.png)
   
## Installation (Browser) (All Platforms)
Copy this code and save it as a bookmark.
```javascript
javascript: (function () {   Game.LoadMod('https://angelolz.dev/mods/ccrpc/main.js'); }());
```

On your Cookie Clicker game, click the bookmark you created. If it asks you if you're sure that you want to load the mod, click **Yes**. *The only reason why it asks this is because the mod is based on the steam version, which is (currently) v1.042. This should still work on the current version that the browser is on now.* 

## Enabling Rich Presence
### Windows
- Just launch the executable program that was in the zip file.

## macOS / Linux
- Open a terminal and navigate to the `app` folder.
- Type the command: `java -jar *.jar`.

If everything was installed correctly, you should see the below output and your rich presence on Discord!
![It's working! :D](https://i.imgur.com/JAIsMk4.png)

# :warning: Warning! :warning: 
**Don't** run this mod on both the Steam version and browser version, the Rich Presence Status will try to update its status from both games, which will look weird!

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
