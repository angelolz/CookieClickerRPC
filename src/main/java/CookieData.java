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

    String cookies, cps;
    String prestige_lvl, resets;
    String season, drops;
    String lumps, lump_status;
    String clicks, cookies_per_click;
    private Config config;

    public String getSeason()
    {
        if(season.equals("fools"))
            return "April Fool's!";
        else
            return season.substring(0, 1).toUpperCase() + season.substring(1);
    }

    public Config getConfig() { return config; }
}
