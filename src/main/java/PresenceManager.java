import club.minnced.discord.rpc.DiscordEventHandlers;
import club.minnced.discord.rpc.DiscordRPC;
import club.minnced.discord.rpc.DiscordRichPresence;

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
            LoggerManager.getLogger().info("Welcome, {}#{}! Started Discord Rich Presence instance.", user.username, user.discriminator);
            LoggerManager.getLogger().info("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
            startTime = System.currentTimeMillis();
        };

        rpc = DiscordRPC.INSTANCE;
        rpc.Discord_Initialize("895895624891895828", handlers, true, "");

        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> rpc.Discord_RunCallbacks(), 0, 1, TimeUnit.SECONDS);
    }

    public static void updateRichPresence(CookieData c) throws UnsupportedOperationException
    {
        if(rpc == null)
            throw new UnsupportedOperationException("Discord Rich Presence isn't initialized yet!");

        DiscordRichPresence presence = new DiscordRichPresence();
        presence.state = c.cps + " per second";
        presence.details = c.cookies + " cookies";
        presence.largeImageKey = "icon";
        presence.largeImageText = "Rich Presence by angelolz";

        if(c.config.show_elapsed_time == 1)
            presence.startTimestamp = startTime;

        switch(c.config.small_icon_mode)
        {
            case 0:
                presence.smallImageKey = "legacy";
                presence.smallImageText = String.format("Prestige Lv. %s with %s ascends", c.prestige_lvl, c.resets);
                break;
            case 1:
                if(c.lumps.equals("-1"))
                {
                    presence.smallImageKey = "normal";
                    presence.smallImageText = "Not growing any sugar lumps";
                }

                else
                {
                    presence.smallImageKey = c.lump_status;
                    presence.smallImageText = String.format("%s sugar lumps | Growing a %s lump", c.lumps, c.lump_status);
                }
                break;
            case 2:
                presence.smallImageKey = "cursor";
                presence.smallImageText = String.format("%s clicks | %s cookies per click", c.clicks, c.cookies_per_click);
                break;
            case 3:
                presence.smallImageKey = "goldencookie";
                presence.smallImageText = String.format("%s GCs clicked | %s GCs missed", c.gc_clicks, c.gc_missed);
                break;
            case 4:
                if(!c.season.isEmpty())
                {
                    presence.smallImageKey = c.season;
                    presence.smallImageText = String.format("%s | %s", c.season_name, c.drops);
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
