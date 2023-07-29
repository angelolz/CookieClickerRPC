# Cookie Clicker Rich Presence Creator
This Cookie Clicker mod allows you to share your game stats with everyone on Discord!
### Requirements
- [Java 8](https://java.com/en/download/) (or higher, although the exe might prompt you to install Java 8 for some reason)

## Mod Installation (Steam)
You can download this mod at the Steam Workshop **[here](https://steamcommunity.com/sharedfiles/filedetails/?id=2708959340)**.

*Note: Linux and macOS compatibility is not tested, as Cookie Clicker does not support these platforms.*

## Mod Installation (Browser)

Put this code in the javascript console:
```javascript
Game.LoadMod('https://angelolz.dev/mods/ccrpc/main.js?v1.3.1');
```

*Note: you would have to do this every time you reload the Cookie Clicker page.*

If everything was installed correctly, you should see the below output and your rich presence on Discord!
![It's working! :D](https://i.imgur.com/JAIsMk4.png)

# Troubleshooting
### "App closes instantly when I run the app"
This is probably because the app is trying to find a Java Runtime Environment and can't find one. Follow the steps for 
Windows in [this site](https://www.geeksforgeeks.org/how-to-set-java-path-in-windows-and-linux/) to set Java in your `PATH` system variable.

# Bugs/Feedback
There are times when I might've left a nasty bug in there, that's my bad! My JavaScript skills aren't the best, since I 
don't have a lot of experience with it. With that said, if you do spot a bug or have any issues, please [open an issue](https://github.com/angelolz1/CookieClickerRPC/issues)!

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

### Streamers!
Hey, if you like Cookie Clicker and you are a streamer, I've made a new stream widget that displays your cookie stats 
[here](https://github.com/angelolz1/cc-stream-overlay)! Check it out :)
