import net.arikia.dev.drpc.DiscordEventHandlers;
import net.arikia.dev.drpc.DiscordRPC;
import net.arikia.dev.drpc.DiscordRichPresence;
import org.apache.catalina.startup.Tomcat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class Main
{
    private static Logger logger;
    private static long startTime;

    public static void main(String[] args) throws Exception
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

        logger.info("Starting websocket server...");
        Tomcat tomcat = new Tomcat();
        tomcat.setPort(6969);

        //if i'm running this in my IDE
        if(new File("src/main/resources/").exists())
            tomcat.addWebapp("", new File("src/main/resources/").getAbsolutePath());

        //if i'm running this in a jar file
        else
        {
            tomcat.addWebapp("", new File(".").getAbsolutePath());
        }

        tomcat.start();
        tomcat.getServer().await();
        logger.info("Websocket server started.");
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
            .setBigImage("cookie", "")
            .build();

        DiscordRPC.discordUpdatePresence(rp);
    }

    public static void updateRichPresence(String cookies, String cps, String level, String resets, String season, String drops)
    {
        DiscordRichPresence.Builder rp = new DiscordRichPresence
            .Builder(cps + " per second")
            .setDetails(cookies + " cookies")
            .setStartTimestamps(startTime)
            .setBigImage("cookie", String.format("Prestige Lv. %s with %s ascends", level, resets));

        if(!season.isEmpty())
        {
            String icon;
            if(season.equals("April Fool's!"))
                icon = "fools";
            else
                icon = season.toLowerCase();

            rp.setSmallImage(icon, String.format("Season: %s | %s", season, drops));
        }

        DiscordRPC.discordUpdatePresence(rp.build());
    }

    public static void setStartTime(long startTime)
    {
        Main.startTime = startTime;
    }
}
