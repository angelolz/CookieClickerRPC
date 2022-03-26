import club.minnced.discord.rpc.DiscordRPC;
import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;

public class Server extends WebSocketServer
{
    public Server(InetSocketAddress address)
    {
        super(address);
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake)
    {
        conn.send("v" + Main.getVersion());
        Main.getLogger().info("Opened a connection with Cookie Clicker.");
        Main.setStartTime(System.currentTimeMillis());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote)
    {
        Main.getLogger().info("Closed connection with Cookie Clicker and stopped Rich Presence status.");
        DiscordRPC.INSTANCE.Discord_ClearPresence();
        Main.setStartTime(System.currentTimeMillis());
    }

    @Override
    public void onMessage(WebSocket conn, String text)
    {
        Main.getLogger().debug("message:\n" + text);

        Gson gson = new Gson();
        CookieData c = gson.fromJson(text, CookieData.class);

        if(!Main.warned && !c.version.equalsIgnoreCase(Main.getVersion()))
        {
            Main.getLogger().warn("Your client is out of date. Please update to the new version by visiting");
            Main.getLogger().warn("https://github.com/angelolz1/CookieClickerRPC/releases");
            Main.warned = true;
        }

        Main.updateRichPresence(c);
    }

    @Override
    public void onMessage( WebSocket conn, ByteBuffer message ) {
        System.out.println("received ByteBuffer from "	+ conn.getRemoteSocketAddress());
    }

    @Override
    public void onError(WebSocket conn, Exception ex)
    {
        Main.getLogger().error("Error on connection {}: {}", conn.getRemoteSocketAddress(), ex);
    }

    @Override
    public void onStart()
    {
        Main.getLogger().info("Server successfully started.");
    }
}
