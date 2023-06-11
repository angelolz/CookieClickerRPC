/*jshint esversion: 8 */
if(DRP === undefined) var DRP = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

//mod info
DRP.name = "Rich Presence";
DRP.id = "angelolz.drp";
DRP.author = "angelolz";
DRP.version = "v1.3.1";
DRP.gameVersion = "2.052";

//other global vars
let cycleIndex = -1;
let notified = false; //for the steam update notif to not show twice lol

DRP.launch = function()
{
	DRP.defaultConfig = {
		PRESTIGE_LONG_SCALE: 1,
		COOKIES_LONG_SCALE: 0,
		SHOW_ELAPSED_TIME: 1,
		SMALL_ICON_MODE: 2,
		SHOW_GUIDE: 1
	}

	//initialize config
	DRP.config = DRP.defaultConfig;

	// save/load mod settings
	DRP.save = function() { return JSON.stringify(DRP.config); }
	DRP.load = function(str) {
		const settings = JSON.parse(str);

		//add new properties that don't exist in current settings
		Object.keys(DRP.defaultConfig).forEach(k => {
			if (!settings.hasOwnProperty(k))
				settings[k] = DRP.defaultConfig[k];
		});

		//delete properties in old settings that don't exist in default settings
		Object.keys(settings).forEach(k => {
			if(!DRP.defaultConfig.hasOwnProperty(k))
				delete settings[k];
		})

		DRP.config = settings;

		if(DRP.config.SHOW_GUIDE === 1 && !notified && typeof Steam == 'object') {
			Game.Notify("DRP+ has been updated!", `Please <a href='https://steamcommunity.com/sharedfiles/filedetails/?id=2633184601' " +
\t\t"target='_blank'>read the guide</a> to enable rich presence. Disable this notice in the settings.`, [5,5], 0, true);
			notified = true;
		}
	}

	DRP.init = function()
	{
		DRP.isLoaded = 1;
		DRP.replaceGameMenu();
		DRP.setupWebSocket();
	}

	//menu stuff here
	DRP.replaceGameMenu = function()
	{
		Game.customOptionsMenu.push(function()
		{
			CCSE.AppendCollapsibleOptionsMenu(DRP.name, DRP.getMenuString());
		});
	}

	DRP.getMenuString = function()
	{
		let m = CCSE.MenuHelper, str;
		str =
			'<div class="listing">' +
			m.ActionButton("DRP.config.SMALL_ICON_MODE == 5 ? DRP.config.SMALL_ICON_MODE = 0 : DRP.config.SMALL_ICON_MODE++; Game.UpdateMenu();", DRP.smallIconSettingText(DRP.config.SMALL_ICON_MODE)) +
			'<label>Toggle what information is displayed for the small icon of your Rich Presence.</label><br>' +
			m.ToggleButton(DRP.config, 'PRESTIGE_LONG_SCALE', "RPC_PRESTIGE_LONG_SCALE", "Long Scale for Prestige Level", "Short Scale for Prestige Level", "DRP.toggle") +
			'<label>Change the scale setting for the Ascension information.</label><br>' +
			m.ToggleButton(DRP.config, 'COOKIES_LONG_SCALE', "RPC_COOKIES_LONG_SCALE", "Long Scale for Cookie Info", "Short Scale for Cookie Info", "DRP.toggle") +
			'<label>Change the scale setting for the Total Cookies and CPS.</label><br>' +
			m.ToggleButton(DRP.config, 'SHOW_ELAPSED_TIME', "RPC_SHOW_ELAPSED_TIME", "Elapsed Time ON", "Elapsed Time OFF", "DRP.toggle") +
			'<label>Toggle display for how long you\'ve been playing this session.</label>';

		if(typeof Steam == 'object') {
			str += '<br>' +
				m.ToggleButton(DRP.config, 'SHOW_GUIDE', "RPC_SHOW_GUIDE", "Show Steam Guide ON", "Show Steam Guide OFF", "DRP.toggle") +
				'<label>Display the link to the Steam guide when the game is launched </label>';
		}

		str += '</div>';

		return str;
	}

	DRP.toggle = function(name, button, on, off, invert)
	{
		if(DRP.config[name])
		{
			l(button).innerHTML = off;
			DRP.config[name] = 0;
		}

		else
		{
			l(button).innerHTML = on;
			DRP.config[name] = 1;
		}

		l(button).className = 'option' + ((DRP.config[name] ^ invert) ? '' : ' off');
	}

	//websocket and update checker
	DRP.setupWebSocket = function ()
	{
		DRP.ws = new WebSocket("ws://localhost:6969/");

		DRP.ws.onopen = function (event)
		{
			console.log("[rich presence] established connection to websocket!")
			DRP.wsCon = true;
			Game.registerHook('check', sendData);
			Game.Notify("Started Rich Presence Server!", `${DRP.version}`, [5,5], 6, false);
		}

		DRP.ws.onclose = function (event) {if(DRP.wsCon) { lostConnection(); }}

		DRP.ws.onerror = function (event)
		{
			Game.Notify("Couldn't connect to Rich Presence Server!", "Please check if the app is open.", [1,7]);
			Game.registerHook('check', reconnect);
		}
	}

	/*
		below are the helper functions for this mod

		!!!NOTE!!!: DRP.getScale and DRP.nFormat are functions that are from the
		Cookie Monster Mod, but are slightly modified. I appreciate the team behind the CM mod.
	*/

	DRP.getScale = function(index, useLong)
	{
		const longScale = [
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

		const shortScale = [
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

	DRP.nFormat = function(num, useLong)
	{
		let val;

		if(num < 1000000) val = num.toLocaleString("en-US");

		else
		{
			const exponential = num.toExponential().toString();
			const amountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
			val = (num / Number(`1e${amountOfTenPowerThree * 3}`)).toFixed(3);
			val += " " + DRP.getScale(amountOfTenPowerThree, useLong);
		}

		return val;
	}

	DRP.getDrops = function(season)
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

	DRP.lumpType = function(type)
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

	DRP.getSeasonName = function(season)
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
			default:
				return "None";
		}
	}

	DRP.smallIconSettingText = function(mode)
	{
		switch(mode)
		{
			case 0:
				return "Show Prestige Info"
			case 1:
				return "Show Sugar Lump Info"
			case 2:
				return "Show Clicks Info"
			case 3:
				return "Show Golden Cookie Info"
			case 4:
				return "Show Current Season Info"
			case 5:
				return "Don't Show Any Info"
		}
	}

	//INIT MOD
	if(CCSE.ConfirmGameVersion(DRP.name, DRP.version, DRP.gameVersion))
		Game.registerMod(DRP.id, DRP);
};

if(!DRP.isLoaded)
{
	if(CCSE && CCSE.isLoaded) DRP.launch();

	else
	{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(DRP.launch);
	}
}

//websocket functions
function sendData()
{
	DRP.ws.send(
		`{
			"version": "${DRP.version}",
			"cookies": "${DRP.nFormat(Game.cookies, DRP.config.COOKIES_LONG_SCALE)}",
			"cps":"${DRP.nFormat(Game.cookiesPs * (1 - Game.cpsSucked), DRP.config.COOKIES_LONG_SCALE)}",
			"prestige_lvl":"${DRP.nFormat(Game.prestige, DRP.config.PRESTIGE_LONG_SCALE)}",
			"resets":"${Game.resets.toString()}",
			"lumps":"${Game.lumps}",
			"lump_status":"${DRP.lumpType(Game.lumpCurrentType)}",
			"clicks":"${DRP.nFormat(Game.cookieClicks)}",
			"cookies_per_click":"${DRP.nFormat(Game.computedMouseCps)}",
			"season":"${Game.season}",
			"season_name":"${DRP.getSeasonName(Game.season)}",
			"drops":"${DRP.getDrops(Game.season)}",
			"gc_clicks":"${DRP.nFormat(Game.goldenClicks)}",
			"gc_missed":"${DRP.nFormat(Game.missedGoldenClicks)}",
			"config": {
				"prestige_long_scale": ${DRP.config.PRESTIGE_LONG_SCALE},
				"cookies_long_scale": ${DRP.config.COOKIES_LONG_SCALE},
				"show_elapsed_time": ${DRP.config.SHOW_ELAPSED_TIME},
				"small_icon_mode": ${DRP.config.SMALL_ICON_MODE},
				"show_guide": ${DRP.config.SHOW_GUIDE}
			}
		}`);
}

function lostConnection()
{
	console.log("[rich presence] Lost connection to websocket and reconnecting...")
	DRP.wsCon = false;
	Game.Notify("Lost connection with Rich Presence Server!", "Check to see if the app is open. Reconnecting...", [1,7]);
	Game.removeHook('check', sendData);
	Game.registerHook('check', reconnect);
}

function reconnect()
{
	if (!DRP.wsCon)
	{
		DRP.ws = new WebSocket("ws://localhost:6969");

		DRP.ws.onopen = function (event)
		{
			console.log("[rich presence] Reconnected to websocket!")
			DRP.wsCon = true;
			Game.Notify("Reconnected to Rich Presence Server!", "", [4, 5]);
			Game.removeHook('check', reconnect);
			Game.registerHook('check', sendData);
		}

		DRP.ws.onclose = function (event)
		{
			if (DRP.wsCon) lostConnection();
		}
	}
}