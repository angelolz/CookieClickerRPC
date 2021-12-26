/*jshint esversion: 8 */

if(RPC === undefined) var RPC = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

//mod info
RPC.name = "Rich Presence+";
RPC.id = "drpplus";
RPC.author = "Angelolz";
RPC.version = "v2.043";
RPC.gameVersion = "2.043";

RPC.launch = function()
{
	RPC.defaultConfig = function()
	{
		return {
			USE_LONG_SCALE: 1,
			MODE: 2
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

		//override rich presence updater
		Steam.logic = function(T)
		{
			if (T>0 && T%(Game.fps*5)==4)
			{
				var arr=[];

				switch(RPC.config.MODE)
				{
					case 0: //show prestige info
						arr[0] = `Prestige Lv. ${RPC.nFormat(Game.prestige)}`
						arr[1] = `${Game.resets.toString()} Ascencions`
						break;
					case 1: //show sugar lump info
						arr[0] = `${Game.lumps == -1 ? "0" : Game.lumps} sugar lumps`
						arr[1] = Game.lumps == -1 ? "No sugar lumps growing" : `Growing a ${RPC.lumpType(Game.lumpCurrentType)} lump`
						break;
					case 2: //show click info
						arr[0] = `${RPC.nFormat(Game.cookieClicks)} clicks`
						arr[1] = `${RPC.nFormat(Game.computedMouseCps)} per click`
						break;
					case 3: //show golden cookie info
						arr[0] = `${RPC.nFormat(Game.goldenClicks)} Golden Cookies clicked`
						arr[1] = `${RPC.nFormat(Game.missedGoldenClicks)} Golden Cookies missed`
						break;
					case 4: //show season info
						arr[0] = `Season: ${RPC.getSeasonName(Game.season)}`
						arr[1] = `${RPC.getDrops(Game.season)}`
						break;
					case 5:	//show cookie info
						arr[0] = `${RPC.nFormat(Game.cookies, RPC.config.COOKIES_LONG_SCALE)} cookies`
						arr[1] = `${RPC.nFormat(Game.cookiesPs * (1 - Game.cpsSucked), RPC.config.COOKIES_LONG_SCALE)} per second`
						break;
				}

				send({id:'update presence',arr:arr})
			}
		}
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
			m.ActionButton("RPC.config.MODE == 5 ? RPC.config.MODE = 0 : RPC.config.MODE++; Game.UpdateMenu();", RPC.smallIconSettingText(RPC.config.MODE)) +
			'<label>Toggle what information is displayed for the small icon of your Rich Presence.</label><br>' +
			m.ToggleButton(RPC.config, 'USE_LONG_SCALE', "RPC_USE_LONG_SCALE", "Long Scale", "Short Scale", "RPC.toggle") +
			'<label>Change the scale setting in the Rich Presence (ex. Quattordec or Quattordecillion).</label><br>' +
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

	/*
		below are the helper functions for this mod

		!!!NOTE!!!: RPC.getScale and RPC.nFormat are functions that are from the
		Cookie Monster Mod, but are slightly modified. I appreciate the team behind the CM mod.
	*/
	RPC.getScale = function(index)
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

		return RPC.config.USE_LONG_SCALE ? longScale[index] : shortScale[index];
	}

	RPC.nFormat = function(num)
	{
		let val;

		if(num < 1000000) val = num.toLocaleString("en-US");

		else
		{
			const exponential = num.toExponential().toString();
			const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
			val = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
			val += " " + RPC.getScale(AmountOfTenPowerThree);
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
	if(CCSE && CCSE.isLoaded) RPC.launch();

	else
	{
		if(!CCSE) var CCSE = {};
		if(!CCSE.postLoadHooks) CCSE.postLoadHooks = [];
		CCSE.postLoadHooks.push(RPC.launch);
	}
}
