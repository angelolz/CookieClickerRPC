/*jshint esversion: 8 */
//if attempting to load the mod on the web version (idk it could happen lol)
if(typeof Steam == 'undefined')
{
	Game.Notify("Wrong DRP+ version!", "The mod you're using for Discord Rich " +
		"Presence+ is meant for <b>Steam only</b>. Please download the one for " +
		"browser <a href='https://github.com/angelolz1/CookieClickerRPC/releases' " +
		"target='_blank'>here</a>!", [1,7])
	throw new Error("The mod was not loaded. This mod was meant for Steam.")
}

if(DRP === undefined) var DRP = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

//mod info
DRP.name = "Rich Presence+";
DRP.id = "drpplus";
DRP.author = "Angelolz";
DRP.version = "v1.1.1";
DRP.gameVersion = "2.048";

//other global vars
var cycleIndex = -1;

DRP.launch = function()
{
	DRP.defaultConfig = function()
	{
		return {
			USE_LONG_SCALE: 1,
			MODE: 2
		}
	}

	//initialize config
	DRP.config = DRP.defaultConfig();

	// save/load mod settings
	DRP.save = function() { return JSON.stringify(DRP.config); }
	DRP.load = function(str) { DRP.config = JSON.parse(str); }

	DRP.init = function()
	{
		DRP.isLoaded = 1;
		DRP.replaceGameMenu();

		//override rich presence updater
		Steam.logic = function(T)
		{
			if (T > 0 && T % (Game.fps*10) == 9)
			{
				var arr;

				if(DRP.config.MODE == 6)
				{
					if(cycleIndex == -1 || cycleIndex == 6) cycleIndex = 0
					arr = DRP.getInfo(cycleIndex);
					cycleIndex++;
				}

				else
				{
					cycleIndex = -1;
					arr = DRP.getInfo(DRP.config.MODE)
				}

				send({id:'update presence',arr:arr})
			}
		}
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
			m.ActionButton("DRP.config.MODE == 6 ? DRP.config.MODE = 0 : DRP.config.MODE++; Game.UpdateMenu();", DRP.smallIconSettingText(DRP.config.MODE)) +
			'<label>Toggle what information is displayed for the status of your Rich Presence.</label><br>' +
			m.ToggleButton(DRP.config, 'USE_LONG_SCALE', "DRP_USE_LONG_SCALE", "Long Scale", "Short Scale", "DRP.toggle") +
			'<label>Change the scale setting in the Rich Presence (ex. Quattordec or Quattordecillion).</label><br>' +
			'</div>';

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

	/*
		below are the helper functions for this mod

		!!!NOTE!!!: DRP.getScale and DRP.nFormat are functions that are from the
		Cookie Monster Mod, but are slightly modified. I appreciate the team behind the CM mod.
	*/

	DRP.getInfo = function(mode)
	{
		var arr = [];
		switch(mode)
		{
			case 0: //show prestige info
				arr[0] = `Prestige Lv. ${DRP.nFormat(Game.prestige)}`
				arr[1] = `${Game.resets.toString()} Ascensions`
				break;
			case 1: //show sugar lump info
				arr[0] = `${Game.lumps == -1 ? "0" : Game.lumps} sugar lumps`
				arr[1] = Game.lumps == -1 ? "No sugar lumps growing" : `Growing a ${DRP.lumpType(Game.lumpCurrentType)} lump`
				break;
			case 2: //show click info
				arr[0] = `${DRP.nFormat(Game.cookieClicks)} clicks`
				arr[1] = `${DRP.nFormat(Game.computedMouseCps)} per click`
				break;
			case 3: //show golden cookie info
				arr[0] = `${DRP.nFormat(Game.goldenClicks)} Golden Cookies clicked`
				arr[1] = `${DRP.nFormat(Game.missedGoldenClicks)} Golden Cookies missed`
				break;
			case 4: //show season info
				arr[0] = `Season: ${DRP.getSeasonName(Game.season)}`
				arr[1] = `${DRP.getDrops(Game.season)}`
				break;
			case 5:	//show cookie info
				arr[0] = `${DRP.nFormat(Game.cookies, DRP.config.COOKIES_LONG_SCALE)} cookies`
				arr[1] = `${DRP.nFormat(Game.cookiesPs * (1 - Game.cpsSucked), DRP.config.COOKIES_LONG_SCALE)} per second`
				break;
		}

		return arr;
	}

	DRP.getScale = function(index)
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

		return DRP.config.USE_LONG_SCALE ? longScale[index] : shortScale[index];
	}

	DRP.nFormat = function(num)
	{
		let val;

		if(num < 1000000) val = num.toLocaleString("en-US");

		else
		{
			const exponential = num.toExponential().toString();
			const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
			val = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
			val += " " + DRP.getScale(AmountOfTenPowerThree);
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
				return "Show Bank and CPS Info"
			case 6:
				return "Cycle Through All Info"
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
