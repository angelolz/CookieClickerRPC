public class CookieData
{
    public class Config
    {
        int prestige_long_scale;
        int cookies_long_scale;
        int elapsed_time;

        public boolean useAscendLongScale()
        {
            return prestige_long_scale == 1 ? true : false;
        }

        public boolean useCookiesLongScale()
        {
            return cookies_long_scale == 1 ? true : false;
        }

        public boolean showElapsedTime()
        {
            return elapsed_time == 1 ? true : false;
        }
    }

    private String cookies;
    private String cps;
    private String prestige_lvl;
    private String resets;
    private String season;
    private String drops;
    private Config config;

    public String getCookies() { return cookies; }
    public String getCPS() { return cps; }
    public String getPrestigeLevel() { return prestige_lvl; }
    public String getResets() { return resets; }
    public String getSeason()
    {
        if(season.equals("fools"))
            return "April Fool's!";
        else
            return season.substring(0, 1).toUpperCase() + season.substring(1);
    }

    public String getDrops() { return drops; }
    public Config getConfig() { return config; }
}
