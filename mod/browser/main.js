/*jshint esversion: 8 */

if(RPC === undefined) var RPC = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

//mod info
RPC.name = "Discord Rich Presence";
RPC.id = "drpbrowser";
RPC.author = "Angelolz";
RPC.version = "v2.031";
RPC.gameVersion = "2.031";

RPC.launch = function()
{
	RPC.defaultConfig = function()
	{
		return {
			PRESTIGE_LONG_SCALE: 1,
			COOKIES_LONG_SCALE: 0,
			SHOW_ELAPSED_TIME: 1,
			SMALL_ICON_MODE: 2
		}
	}

	RPC.config = RPC.defaultConfig();

	// save/load mod settings
	RPC.save = function() { return JSON.stringify(RPC.config); }
	RPC.load = function(str) { RPC.config = JSON.parse(str); }

	RPC.init = function()
	{
		RPC.isLoaded = 1;
		RPC.replaceGameMenu();
		RPC.setupWebSocket();
		RPC.checkUpdate();
	}


	RPC.replaceGameMenu = function()
	{
		Game.customOptionsMenu.push(function()
		{
			CCSE.AppendCollapsibleOptionsMenu(RPC.name, RPC.getMenuString());
		});
	}

	RPC.getMenuString = function()
	{
		let m = CCSE.MenuHelper, str;
		str =
			'<div class="listing">' +
			m.ActionButton("RPC.config.SMALL_ICON_MODE == 5 ? RPC.config.SMALL_ICON_MODE = 0 : RPC.config.SMALL_ICON_MODE++; Game.UpdateMenu();", RPC.smallIconSettingText(RPC.config.SMALL_ICON_MODE)) +
			'<label>Toggle what information is displayed for the small icon of your Rich Presence.</label>' +
			m.ToggleButton(RPC.config, 'PRESTIGE_LONG_SCALE', "RPC_PRESTIGE_LONG_SCALE", "Long Scale for Prestige Level", "Short Scale for Prestige Level", "RPC.toggle") +
			'<label>Change the scale setting for the Ascension information.</label><br>' +
			m.ToggleButton(RPC.config, 'COOKIES_LONG_SCALE', "RPC_COOKIES_LONG_SCALE", "Long Scale for Cookie Info", "Short Scale for Cookie Info", "RPC.toggle") +
			'<label>Change the scale setting for the Total Cookies and CPS.</label><br>' +
			m.ToggleButton(RPC.config, 'SHOW_ELAPSED_TIME', "RPC_SHOW_ELAPSED_TIME", "Elapsed Time ON", "Elapsed Time OFF", "RPC.toggle") +
			'<label>Toggle display for how long you\'ve been playing this session.</label><br>' +
			'</div>';

		return str;
	}

	RPC.toggle = function(name, button, on, off, invert)
	{
		if(RPC.config[name])
		{
			l(button).innerHTML = off;
			RPC.config[name] = 0;
		}

		else
		{
			l(button).innerHTML = on;
			RPC.config[name] = 1;
		}

		l(button).className = 'option' + ((RPC.config[name] ^ invert) ? '' : ' off');
	}

	RPC.setupWebSocket = function ()
	{
		RPC.ws = new WebSocket("ws://localhost:6969/");

		RPC.ws.onopen = function (event)
		{
			console.log("[rich presence] established connection to websocket!")
			RPC.wsCon = true;
			Game.registerHook('check', sendData);
			Game.Notify("Started Rich Presence Server!", `${RPC.version}`, [5,5], 6, false);
		}

		RPC.ws.onclose = function (event) {if(RPC.wsCon) { lostConnection(); }}

		RPC.ws.onerror = function (event)
		{
			Game.Notify("Couldn't connect to Rich Presence Server!", "Please check if the app is open.", [1,7]);
			Game.registerHook('check', reconnect);
		}
	}

	RPC.checkUpdate = async function ()
	{
		var res = await fetch("https://api.github.com/repos/angelolz1/CookieClickerRPC/releases/latest");
		var json = await res.json();

		if(json.tag_name != RPC.version)
		{
			Game.Notify("New update to Rich Presence!", `<a ${Game.clickStr}="Steam.openLink('https://github.com/angelolz1/CookieClickerRPC/releases')">Click here</a> to download it!`, [16,5]);
		}
	}

	/*
		below are the helper functions for this mod

		!!!NOTE!!!: RPC.getScale and RPC.nFormat are functions that are from the
		Cookie Monster Mod, but are slightly modified. I appreciate the team behind the CM mod.
	*/
	RPC.getScale = function(index, useLong)
	{
		longScale = [
			'',
			'',
			'Million',
			'Billion',
			'Trillion',
			'Quadrillion',
			'Quintillion',
			'Sextillion',
			'Septillion',
			'Octillion',
			'Nonillion',
			'Decillion',
			'Undecillion',
			'Duodecillion',
			'Tredecillion',
			'Quattuordecillion',
			'Quindecillion',
			'Sexdecillion',
			'Septendecillion',
			'Octodecillion',
			'Novemdecillion',
			'Vigintillion',
			'Unvigintillion',
			'Duovigintillion',
			'Trevigintillion',
			'Quattuorvigintillion',
		];

		shortScale = [
			'',
			'',
			'M',
			'B',
			'Tr',
			'Quadri',
			'Quint',
			'Sext',
			'Sept',
			'Oct',
			'Non',
			'Dec',
			'Undec',
			'Duodec',
			'Tredec',
			'Quattuordec',
			'Quindec',
			'Sexdec',
			'Septendec',
			'Octodec',
			'Novemdec',
			'Vigint',
			'Unvigint',
			'Duovigint',
			'Trevigint',
			'Quattuorvigint',
		];

		return useLong ? longScale[index] : shortScale[index];
	}

	RPC.nFormat = function(num, useLong)
	{
		let val;

		if(num < 1000000) val = num.toLocaleString("en-US");

		else
		{
			const exponential = num.toExponential().toString();
			const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
			val = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
			val += " " + RPC.getScale(AmountOfTenPowerThree, useLong);
		}

		return val;
	}

	RPC.getDrops = function(season)
	{
		switch(season)
		{
			case "halloween":
				return `${Game.GetHowManyHalloweenDrops()}/${Game.halloweenDrops.length} cookies`;
			case "christmas":
				return `${Game.GetHowManySantaDrops()}/${Game.santaDrops.length} gifts
				and ${Game.GetHowManyReindeerDrops()}/${Game.reindeerDrops.length} cookies`;
			case "valentines":
				return `${Game.GetHowManyHeartDrops()}/${Game.heartDrops.length} biscuits`;
			case "easter":
				return `${Game.GetHowManyEggs()}/${Game.easterEggs.length} eggs`;
			case "fools":
				//fools doesn't have any drops
				return "Business. Serious Business."
			default:
				return "";
		}
	}

	RPC.lumpType = function(type)
	{
		switch(type)
		{
			case 0:
				return "normal";
			case 1:
				return "bifurcated";
			case 2:
				return "golden";
			case 3:
				return "meaty";
			case 4:
				return "caramelized";
		}
	}

	RPC.getSeasonName = function(season)
	{
		switch(season)
		{
			case "christmas":
				return Game.seasons.christmas.name
			case "easter":
				return Game.seasons.easter.name
			case "fools":
				return Game.seasons.fools.name
			case "halloween":
				return Game.seasons.halloween.name
			case "valentines":
				return Game.seasons.valentines.name
		}
	}

	RPC.smallIconSettingText = function(mode)
	{
		switch(mode)
		{
			case 0:
				return "Show Prestige Info";
			case 1:
				return "Show Sugar Lump Info";
			case 2:
				return "Show Clicks Info";
			case 3:
				return "Show Golden Cookie Info";
			case 4:
				return "Show Current Season Info"
			case 5:
				return "Don't Show Any Info"
		}
	}

	//INIT MOD
	if(CCSE.ConfirmGameVersion(RPC.name, RPC.version, RPC.gameVersion))
	{
		Game.registerMod(RPC.id, RPC);
	}
};

if(!RPC.isLoaded)
{
	if(CCSE && CCSE.isLoaded)
	{
		RPC.launch();
	}

	else
	{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(RPC.launch);
	}
}

// websocket functions
function sendData()
{
	RPC.ws.send(
		`{
			"version": "${RPC.version}",
			"cookies": "${RPC.nFormat(Game.cookies, RPC.config.COOKIES_LONG_SCALE)}",
			"cps":"${RPC.nFormat(Game.cookiesPs * (1 - Game.cpsSucked), RPC.config.COOKIES_LONG_SCALE)}",
			"prestige_lvl":"${RPC.nFormat(Game.prestige, RPC.config.PRESTIGE_LONG_SCALE)}",
			"resets":"${Game.resets.toString()}",
			"lumps":"${Game.lumps}",
			"lump_status":"${RPC.lumpType(Game.lumpCurrentType)}",
			"clicks":"${RPC.nFormat(Game.cookieClicks)}",
			"cookies_per_click":"${RPC.nFormat(Game.computedMouseCps)}",
			"season":"${Game.season}",
			"season_name":"${RPC.getSeasonName(Game.season)}",
			"drops":"${RPC.getDrops(Game.season)}",
			"gc_clicks":"${RPC.nFormat(Game.goldenClicks)}",
			"gc_missed":"${RPC.nFormat(Game.missedGoldenClicks)}",
			"config": {
				prestige_long_scale: ${RPC.config.PRESTIGE_LONG_SCALE},
				cookies_long_scale: ${RPC.config.COOKIES_LONG_SCALE},
				show_elapsed_time: ${RPC.config.SHOW_ELAPSED_TIME},
				small_icon_mode: ${RPC.config.SMALL_ICON_MODE}
			}
		}`);
}

function lostConnection()
{
	console.log("[rich presence] Lost connection to websocket and reconnecting...")
	RPC.wsCon = false;
	Game.Notify("Lost connection with Rich Presence Server!", "Check to see if the app is open. Reconnecting...", [1,7]);
	Game.removeHook('check', sendData);
	Game.registerHook('check', reconnect);
}

function reconnect()
{
	if (!RPC.wsCon)
	{
		RPC.ws = new WebSocket("ws://localhost:6969");

		RPC.ws.onopen = function (event)
		{
			console.log("[rich presence] Reconnected to websocket!")
			RPC.wsCon = true;
			Game.Notify("Reconnected to Rich Presence Server!", "", [4, 5]);
			Game.removeHook('check', reconnect);
			Game.registerHook('check', sendData);
		}

		RPC.ws.onclose = function (event)
		{
			if (RPC.wsCon)
			{
				lostConnection();
			}
		}
	}
}
