# Cookie Clicker Rich Presence Client
This Cookie Clicker mod allows you to share your game stats with everyone on Discord!
### Requirements
- Java 1.8 or higher

## Mod Installation (Steam)
You can download this mod at the Steam Workshop **[here](https://steamcommunity.com/sharedfiles/filedetails/?id=2708959340)**.

## Mod Installation (Browser)
Put this code in the javascript console:
```javascript
Game.LoadMod('https://ccrpc.angelolz.one');
```
*Note: you would have to do this every time you reload the Cookie Clicker page.*

## Running the server
### Windows
- Download the Windows version of the latest release.
- Run the `start_windows.bat` file.

### Mac / Linux
- Download the Mac/Linux version of the latest release.
- Run the `start_mac_linux.sh` file. You may need to run it from terminal.
- If the file isn't executable, you may need to use `chmod +x start_mac_linux.sh`.


If everything was installed correctly, you should see the below output and your rich presence on Discord!
![It's working! :D](https://i.imgur.com/JAIsMk4.png)

# Bugs/Feedback
If the JAR shows an error, and you can't figure out how to fix it, please [open an issue](https://github.com/angelolz1/CookieClickerRPC/issues).
If you spot a bug or have any issues/suggestions, please [open an issue](https://github.com/angelolz1/CookieClickerRPC/issues)!

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
