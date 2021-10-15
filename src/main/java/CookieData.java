public class CookieData
{
    public class Config
    {
        boolean ascend_long_scale;
        boolean cookies_long_scale;
        boolean elapsed_time;
    }

    private String cookies;
    private String cps;
    private String prestige_lvl;
    private String resets;
    private String season;
    private String drops;

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
}
