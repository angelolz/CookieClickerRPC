package managers;

import club.minnced.discord.rpc.DiscordEventHandlers;
import club.minnced.discord.rpc.DiscordRPC;
import club.minnced.discord.rpc.DiscordRichPresence;
import objs.CookieData;

import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class PresenceManager
{
    private static DiscordRPC rpc;
    private static long startTime;

    public static void init()
    {
        DiscordEventHandlers handlers = new DiscordEventHandlers();
        handlers.ready = user -> {
            LoggerManager.getLogger().info("Welcome, {}! Started Discord Rich Presence instance.", user.username);
            LoggerManager.getLogger().info("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
            startTime = System.currentTimeMillis();
        };

        rpc = DiscordRPC.INSTANCE;
        rpc.Discord_Initialize("895895624891895828", handlers, true, "");

        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> rpc.Discord_RunCallbacks(), 0, 1, TimeUnit.SECONDS);
    }

    public static void updateRichPresence(CookieData cookieData) throws UnsupportedOperationException
    {
        if(rpc == null)
            throw new UnsupportedOperationException("Discord Rich Presence isn't initialized yet!");

        DiscordRichPresence presence = new DiscordRichPresence();
        presence.state = cookieData.getCookiesPerSecond() + " per second";
        presence.details = cookieData.getCookies() + " cookies";
        presence.largeImageKey = "icon";
        presence.largeImageText = "Rich Presence by angelolz";

        if(cookieData.getConfig().getShowElapsedTime() == 1)
            presence.startTimestamp = startTime;

        switch(cookieData.getConfig().getSmallIconMode())
        {
            case 0:
                presence.smallImageKey = "legacy";
                presence.smallImageText = String.format("Prestige Lv. %s with %s ascends", cookieData.getPrestigeLevel(), cookieData.getResets());
                break;
            case 1:
                if(cookieData.getLumps().equals("-1"))
                {
                    presence.smallImageKey = "normal";
                    presence.smallImageText = "Not growing any sugar lumps";
                }

                else
                {
                    presence.smallImageKey = cookieData.getLumpStatus();
                    presence.smallImageText = String.format("%s sugar lumps | Growing a %s lump", cookieData.getLumps(), cookieData.getLumpStatus());
                }
                break;
            case 2:
                presence.smallImageKey = "cursor";
                presence.smallImageText = String.format("%s clicks | %s cookies per click", cookieData.getClicks(), cookieData.getCookiesPerClick());
                break;
            case 3:
                presence.smallImageKey = "goldencookie";
                presence.smallImageText = String.format("%s GCs clicked | %s GCs missed", cookieData.getGoldenCookiesClicked(), cookieData.getGoldenCookiesMissed());
                break;
            case 4:
                if(!cookieData.getSeason().isEmpty())
                {
                    presence.smallImageKey = cookieData.getSeason();
                    presence.smallImageText = String.format("%s | %s", cookieData.getSeasonName(), cookieData.getDrops());
                }
                break;
            default:
                break;
        }

        rpc.Discord_UpdatePresence(presence);
    }

    public static void setStartTime(long ms)
    {
        startTime = ms;
    }
}
