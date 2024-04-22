package managers;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;
import java.util.Scanner;

public class ConfigManager
{
    private static final String CONFIG_FILE = "config.properties";
    private static Properties config;

    public static void init()
    {
        if(!new File(CONFIG_FILE).exists())
            setupConfig();
        else
            loadConfig();
    }

    private static void setupConfig()
    {
        Scanner scanner = new Scanner(System.in);
        config = new Properties();
        boolean ask = true;
        while(ask)
        {
            System.out.print("[Yes/No] Are you playing on the Steam version of Cookie Clicker? ");
            String response = scanner.nextLine();

            if(response.equalsIgnoreCase("y") || response.equalsIgnoreCase("yes"))
            {
                config.put("useSteam", "true");
                ask = false;
            }

            else if(response.equalsIgnoreCase("n") || response.equalsIgnoreCase("no"))
            {
                config.put("useSteam", "false");
                ask = false;
            }

            else
                System.out.println("That is a not a valid answer.");
        }

        scanner.close();
        saveConfig();
    }

    private static void loadConfig()
    {
        try(FileInputStream fileInputStream = new FileInputStream(CONFIG_FILE))
        {
            Properties properties = new Properties();
            properties.load(fileInputStream);
            config = properties;
            LoggerManager.getLogger().info("Loaded config.");
        }

        catch(IOException e)
        {
            LoggerManager.getLogger().error("Unable to load config. IOException error: {}", e.getMessage());
        }
    }

    public static void saveConfig()
    {
        try(FileOutputStream fos = new FileOutputStream(CONFIG_FILE))
        {
            config.store(fos, null);
            LoggerManager.getLogger().info("Saved preferences to \"config.properties\".");
        }

        catch(IOException e)
        {
            LoggerManager.getLogger().error("Unable to save config. IOException error: {}", e.getMessage());
        }
    }

    public static Properties getConfig()
    {
        if(config == null)
            loadConfig();

        return config;
    }
}
