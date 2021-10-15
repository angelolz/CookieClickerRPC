import java.net.InetSocketAddress;
import java.text.NumberFormat;
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

        logger.info("Starting Discord rich presence...");
        DiscordEventHandlers handlers = new DiscordEventHandlers.Builder()
            .setReadyEventHandler((user) -> logger.info("Welcome, {}#{}! Started Discord Rich Presence Instance.", user.username, user.discriminator))
            .build();
        DiscordRPC.discordInitialize("895895624891895828", handlers, true);

        initRunCallbacks();
        newRichPresence();
        startTime = System.currentTimeMillis();
        logger.info("Discord rich presence created.");

        WebSocketServer server = new Server(new InetSocketAddress("localhost", 6969));
        server.run();
    }

    public static Logger getLogger() { return logger; }

    private static void initRunCallbacks()
    {
        Executors.newSingleThreadScheduledExecutor()
            .scheduleAtFixedRate(DiscordRPC::discordRunCallbacks, 0, 1, TimeUnit.SECONDS);
    }

    private static void newRichPresence()
    {
        DiscordRichPresence rp = new DiscordRichPresence
            .Builder("Just started playing")
            .setBigImage("icon", "")
            .build();

        DiscordRPC.discordUpdatePresence(rp);
    }

    public static void updateRichPresence(String cookies, String cps, String level, String resets, String season, String drops)
    {
        DiscordRichPresence.Builder rp = new DiscordRichPresence
            .Builder(cps + " per second")
            .setDetails(cookies + " cookies")
            .setStartTimestamps(startTime);

        if(Integer.parseInt(level) == 0)
            rp.setBigImage("icon", "");
        else
            rp.setBigImage("icon", String.format("Prestige Lv. %s with %s ascends", formatNum(level), resets));

        if(!season.isEmpty())
        {
            String icon;
            if(season.equals("April Fool's!"))
                icon = "fools";
            else
                icon = season.toLowerCase();

            rp.setSmallImage(icon, String.format("%s | %s", season, drops));
        }

        DiscordRPC.discordUpdatePresence(rp.build());
    }

    public static void setStartTime(long startTime)
    {
        Main.startTime = startTime;
    }

    private static String formatNum(String num)
    {
        NumberFormat fmt = NumberFormat.getInstance();
        fmt.setGroupingUsed(true);
        return fmt.format(Long.parseLong(num));
    }
}
