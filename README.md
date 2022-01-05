# Cookie Clicker Rich Presence Creator
This Cookie Clicker mod will allow you to share your game stats with everyone on Discord!

## Requirements
- CCSE
- The Rich Presence Cookie Clicker mod
- The Rich Presence Java Client
- [Java 8](https://java.com/en/download/) (or higher, although the exe might prompt you to install Java 8 for some reason)

## Mod Installation (Steam)
You can download this mod at the Steam Workshop **[here](https://steamcommunity.com/sharedfiles/filedetails/?id=2708959340)**.
Unfortunately, you won't be able to have a small icon like the browser version of the mod does, but it does allow you to
cycle through all the possible information that the mod provides :)
   
## Installation (Browser)
Run the executable program. Upon running the program, it should automatically open the Cookie Clicker website for you.

Copy this code and save it as a bookmark.
```javascript
javascript: (function () {   Game.LoadMod('https://angelolz.dev/mods/ccrpc/main.js'); }());
```

## Enabling Rich Presence
### Windows
- Just launch the executable program!

### macOS / Linux
- Open a terminal and navigate to where the jar file is stored using the `cd` command.
- Type the command: `java -jar *.jar`.

If everything was installed correctly, you should see the below output and your rich presence on Discord!
![It's working! :D](https://i.imgur.com/JAIsMk4.png)

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

If you want to support me for my work, feel free to give me a [Ko-Fi](https://ko-fi.com/angelolz)!