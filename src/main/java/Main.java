import java.awt.*;
import java.net.URI;
import org.java_websocket.server.WebSocketServer;

public class Main
{
    private static final String VERSION = "1.3.1";

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
            if(ConfigManager.getConfig().getProperty("useSteam") == null)
            {
                LoggerManager.getLogger().warn("Couldn't find 'useSteam' option in config.properties. Defaulting to FALSE.");
                ConfigManager.getConfig().put("useSteam", false);
                ConfigManager.saveConfig();
            }

            Desktop d = Desktop.getDesktop();

            if(ConfigManager.getConfig().getProperty("useSteam").equals("true"))
            {
                d.browse(new URI("steam://run/1454400"));
                LoggerManager.getLogger().info("Opened Cookie Clicker on Steam.");
            }

            else
            {
                d.browse(new URI("https://orteil.dashnet.org/cookieclicker/"));
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
