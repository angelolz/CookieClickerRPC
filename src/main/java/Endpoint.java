import com.google.gson.Gson;
import net.arikia.dev.drpc.DiscordRPC;

import javax.websocket.*;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/update")
public class Endpoint
{
    @OnOpen
    public void onOpen(Session session)
    {
        Main.getLogger().info("Opened a connection.");
        Main.setStartTime(System.currentTimeMillis());
    }


    @OnClose
    public void onClose(Session session)
    {
        Main.getLogger().info("Closed connection and stopped Rich Presence status.");
        DiscordRPC.discordClearPresence();
        Main.setStartTime(System.currentTimeMillis());
    }

    @OnMessage
    public void onMessage(String text)
    {
        Main.getLogger().debug("message:" + text);

        Gson gson = new Gson();
        CookieData c = gson.fromJson(text, CookieData.class);

        Main.updateRichPresence(
            c.getCookies(), c.getCPS(), c.getPrestigeLevel(),
            c.getResets(), c.getSeason(), c.getDrops()
        );
    }

    @OnError
    public void onError(Session session, Throwable throwable)
    {
        Main.getLogger().error("ERROR: {}:{}", throwable.getClass().getName(), throwable.getMessage());
    }
}