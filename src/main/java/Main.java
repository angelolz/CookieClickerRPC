import java.net.InetSocketAddress;
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

    public static void main(String[] args)
    {
        logger = LoggerFactory.getLogger(Main.class);

        DiscordEventHandlers handlers = new DiscordEventHandlers.Builder()
            .setReadyEventHandler((user) -> {
                logger.info("Welcome, {}#{}! Started Discord Rich Presence instance.", user.username, user.discriminator);
                logger.info("Your Rich Presence will show once Cookie Clicker is open.");
            })
            .build();
        DiscordRPC.discordInitialize("895895624891895828", handlers, true);
        initRunCallbacks();

        startTime = System.currentTimeMillis();

        WebSocketServer server = new Server(new InetSocketAddress("localhost", 6969));
        server.run();
    }

    public static Logger getLogger() { return logger; }

    private static void initRunCallbacks()
    {
        Executors.newSingleThreadScheduledExecutor()
            .scheduleAtFixedRate(DiscordRPC::discordRunCallbacks, 0, 1, TimeUnit.SECONDS);
    }

    public static void updateRichPresence(CookieData c)
    {
        DiscordRichPresence.Builder rp = new DiscordRichPresence
            .Builder(c.cps + " per second")
            .setDetails(c.cookies + " cookies");

        if(c.getConfig().showElapsedTime())
        {
            rp.setStartTimestamps(startTime);
        }

        if(c.prestige_lvl.equals("0"))
            rp.setBigImage("icon", "");
        else
            rp.setBigImage("icon", String.format("Prestige Lv. %s with %s ascends", c.prestige_lvl, c.resets));

        switch(c.getConfig().smallIconMode())
        {
            case 0:
                if(!c.getSeason().isEmpty())
                {
                    String icon;
                    if(c.getSeason().equals("April Fool's!"))
                        icon = "fools";
                    else
                        icon = c.getSeason().toLowerCase();

                    rp.setSmallImage(icon, String.format("%s | %s", c.getSeason(), c.drops));
                }
                break;
            case 1:
                rp.setSmallImage(c.lump_status, String.format("%s sugar lumps | Growing a %s lump",c.lumps, c.lump_status));
                break;
            case 2:
                rp.setSmallImage("cursor", String.format("%s clicks | %s cookies per click", c.clicks, c.cookies_per_click));
                break;
            default:
                break;
        }

        DiscordRPC.discordUpdatePresence(rp.build());
    }

    public static void setStartTime(long startTime)
    {
        Main.startTime = startTime;
    }
}
