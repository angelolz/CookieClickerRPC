import club.minnced.discord.rpc.DiscordRPC;
import com.google.gson.Gson;
import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import java.net.InetSocketAddress;
import java.nio.ByteBuffer;

public class Server extends WebSocketServer
{
    private WebSocket overlayWebSocket;
    private boolean outdatedVersionWarned;

    public Server()
    {
        super(new InetSocketAddress("localhost", 6969));
        outdatedVersionWarned = false;
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake)
    {
        if(conn.getResourceDescriptor().equals("/ws"))
            overlayWebSocket = conn;

        LoggerManager.getLogger().info("Opened a connection with Cookie Clicker.");
        PresenceManager.setStartTime(System.currentTimeMillis());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote)
    {
        if(conn.getResourceDescriptor().equals("/ws"))
            overlayWebSocket = null;

        LoggerManager.getLogger().info("Closed connection with Cookie Clicker and stopped Rich Presence status.");
        DiscordRPC.INSTANCE.Discord_ClearPresence();
        PresenceManager.setStartTime(System.currentTimeMillis());
    }

    @Override
    public void onMessage(WebSocket conn, String text)
    {
        LoggerManager.getLogger().debug("message:\n{}", text);

        Gson gson = new Gson();
        CookieData c = gson.fromJson(text, CookieData.class);

        if(!outdatedVersionWarned && !c.version.equalsIgnoreCase("v" + Main.getVersion()))
        {
            LoggerManager.getLogger().warn("--------------------------------------------");
            LoggerManager.getLogger().warn("This app is out of date. Please update to the new version by visiting");
            LoggerManager.getLogger().warn("https://github.com/angelolz1/CookieClickerRPC/releases");
            LoggerManager.getLogger().warn("--------------------------------------------");
            outdatedVersionWarned = true;
        }

        PresenceManager.updateRichPresence(c);

        if(overlayWebSocket != null)
            overlayWebSocket.send(text);
    }

    @Override
    public void onMessage( WebSocket conn, ByteBuffer message ) { /* ignored */ }

    @Override
    public void onError(WebSocket conn, Exception ex)
    {
        LoggerManager.getLogger().error("Error on connection {} : {}", conn.getRemoteSocketAddress(), ex.getMessage());
    }

    @Override
    public void onStart()
    {
        LoggerManager.getLogger().info("Server successfully started.");
    }
}
