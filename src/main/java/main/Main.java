package main;

import java.awt.*;
import java.net.URI;

import managers.ConfigManager;
import managers.LoggerManager;
import managers.PresenceManager;
import org.java_websocket.server.WebSocketServer;

public class Main
{
    private static final String VERSION = "1.3.2";
    private static final String STEAM_URI = "steam://run/1454400";
    private static final String SITE_URL = "https://orteil.dashnet.org/cookieclicker/";

    public static void main(String[] args)
    {
        LoggerManager.init();
        LoggerManager.getLogger().info("Cookie Clicker - Discord Rich Presence v{}", VERSION);

        ConfigManager.init();
        PresenceManager.init();
        openCookieClicker();

        WebSocketServer server = new Server();
        server.run();
    }

    public static String getVersion() { return VERSION; }

    private static void openCookieClicker()
    {
        LoggerManager.getLogger().info("Attempting to open Cookie Clicker...");

        try
        {
            String useSteam = ConfigManager.getConfig().getProperty("useSteam");
            if(useSteam == null)
            {
                LoggerManager.getLogger().warn("Couldn't find 'useSteam' option in config.properties. Defaulting to FALSE.");
                ConfigManager.getConfig().put("useSteam", false);
                ConfigManager.saveConfig();
                return;
            }

            Desktop d = Desktop.getDesktop();
            if(useSteam.equals("true"))
            {
                d.browse(new URI(STEAM_URI));
                LoggerManager.getLogger().info("Opened Cookie Clicker on Steam.");
            }

            else
            {
                d.browse(new URI(SITE_URL));
                LoggerManager.getLogger().info("Opened Cookie Clicker on website.");
            }
        }

        catch(Exception e)
        {
            LoggerManager.getLogger().error("Unable to open Cookie Clicker. Please open manually.");
            LoggerManager.getLogger().debug("Error: {}", e.getMessage());
        }
    }
}
