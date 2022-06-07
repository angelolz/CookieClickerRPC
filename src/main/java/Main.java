import java.awt.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import club.minnced.discord.rpc.DiscordEventHandlers;
import club.minnced.discord.rpc.DiscordRPC;
import club.minnced.discord.rpc.DiscordRichPresence;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main
{
    private static DiscordRPC lib;
    private static Logger logger;
    private static long startTime;
    private final static String version = "v1.2.1";
    public static boolean warned = false;

    public static void main(String[] args)
    {
        logger = LoggerFactory.getLogger(Main.class);
        logger.info("Cookie Clicker - Discord Rich Presence {}", version);

        lib = DiscordRPC.INSTANCE;
        DiscordEventHandlers handlers = new DiscordEventHandlers();
        handlers.ready = (user) -> {
                logger.info("Welcome, {}#{}! Started Discord Rich Presence instance.", user.username, user.discriminator);
                logger.info("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
            };
        lib.Discord_Initialize("895895624891895828", handlers, true, "");

        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> lib.Discord_RunCallbacks(), 0, 1, TimeUnit.SECONDS);

        startTime = System.currentTimeMillis();

        logger.info("Attempting to open Cookie Clicker website...");
        try
        {
            Desktop d = Desktop.getDesktop();
            d.browse(new URI("https://orteil.dashnet.org/cookieclicker/"));
            logger.info("Opened website.");
        }

        catch(Exception e)
        {
            logger.error("Unable to open Cookie Clicker website. Please manually open the Cookie Clicker website in your browser.");
            logger.debug("Error: {}", e.getMessage());
        }

        WebSocketServer server = new Server(new InetSocketAddress("localhost", 6969));
        server.run();
    }

    public static Logger getLogger() { return logger; }

    public static String getVersion() { return version; }

    public static void updateRichPresence(CookieData c)
    {
        DiscordRichPresence presence = new DiscordRichPresence();
        presence.state = c.cps + " per second";
        presence.details = c.cookies + " cookies";

        presence.largeImageKey = "icon";
        presence.largeImageText = "Rich Presence by Angelolz";

        if(c.config.show_elapsed_time == 1) presence.startTimestamp = startTime;

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
            case 5:
                break;
        }

        lib.Discord_UpdatePresence(presence);
    }

    public static void setStartTime(long startTime) { Main.startTime = startTime; }
}
