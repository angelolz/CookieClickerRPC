import java.awt.*;
import java.net.InetSocketAddress;
import java.net.URI;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

import net.arikia.dev.drpc.DiscordEventHandlers;
import net.arikia.dev.drpc.DiscordRPC;
import net.arikia.dev.drpc.DiscordRichPresence;
import org.java_websocket.server.WebSocketServer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Main
{
    private static Logger logger;
    private static long startTime;
    private final static String version = "1.1";

    public static void main(String[] args)
    {
        logger = LoggerFactory.getLogger(Main.class);
        logger.info("Cookie Clicker - Discord Rich Presence v{}", version);

        DiscordEventHandlers handlers = new DiscordEventHandlers.Builder()
            .setReadyEventHandler((user) -> {
                logger.info("Welcome, {}#{}! Started Discord Rich Presence instance.", user.username, user.discriminator);
                logger.info("Your Rich Presence will show once the Cookie Clicker mod is loaded.");
            })
            .build();
        DiscordRPC.discordInitialize("895895624891895828", handlers, true);
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(DiscordRPC::discordRunCallbacks, 0, 1, TimeUnit.SECONDS);

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

    public static void updateRichPresence(CookieData c)
    {
        DiscordRichPresence.Builder rp = new DiscordRichPresence
            .Builder(c.cps + " per second")
            .setDetails(c.cookies + " cookies")
            .setBigImage("icon", "Rich Presence by Angelolz");

        if(c.config.show_elapsed_time == 1) rp.setStartTimestamps(startTime);

        switch(c.config.small_icon_mode)
        {
            case 0:
                rp.setSmallImage("legacy", String.format("Prestige Lv. %s with %s ascends", c.prestige_lvl, c.resets));
                break;
            case 1:
                if(c.lumps.equals("-1"))
                    rp.setSmallImage("normal", "Not growing any sugar lumps");
                else
                    rp.setSmallImage(c.lump_status, String.format("%s sugar lumps | Growing a %s lump", c.lumps, c.lump_status));
                break;
            case 2:
                rp.setSmallImage("cursor", String.format("%s clicks | %s cookies per click", c.clicks, c.cookies_per_click));
                break;
            case 3:
                rp.setSmallImage("goldencookie", String.format("%s GCs clicked | %s GCs missed", c.gc_clicks, c.gc_missed));
                break;
            case 4:
                if(!c.season.isEmpty())
                    rp.setSmallImage(c.season, String.format("%s | %s", c.season_name, c.drops));
                break;
            case 5:
                break;
        }

        DiscordRPC.discordUpdatePresence(rp.build());
    }

    public static void setStartTime(long startTime) { Main.startTime = startTime; }
}
