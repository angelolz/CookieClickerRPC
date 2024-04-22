package managers;

import main.Main;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggerManager
{
    private static Logger logger;

    public static void init()
    {
        logger = LoggerFactory.getLogger(Main.class);
        logger.info("Logger initialized.");
    }

    public static Logger getLogger()
    {
        return logger;
    }
}
