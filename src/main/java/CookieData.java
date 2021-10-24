public class CookieData
{
    public class Config
    {
        int prestige_long_scale;
        int cookies_long_scale;
        int show_elapsed_time;
        int small_icon_mode;

        public boolean showElapsedTime()
        {
            return show_elapsed_time == 1 ? true : false;
        }

        public int smallIconMode() { return small_icon_mode; }
    }

    String version;
    String cookies, cps;
    String prestige_lvl, resets;
    String lumps, lump_status;
    String clicks, cookies_per_click;
    String season, drops;
    String gc_clicks, gc_missed;
    private Config config;

    public String getSeason()
    {
        if(!season.isEmpty())
        {
            if(season.equals("fools"))
                return "April Fool's!";
            else
                return season.substring(0, 1).toUpperCase() + season.substring(1);
        }

        else
            return "";
    }

    public Config getConfig() { return config; }
}
