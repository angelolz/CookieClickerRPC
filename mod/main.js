/*jshint esversion: 6 */

if(RPC === undefined) var RPC = {};
if(typeof CCSE == 'undefined') Game.LoadMod('https://klattmose.github.io/CookieClicker/CCSE.js');

//mod info
RPC.name = "Discord Rich Presence";
RPC.id = "cc-rpc"
RPC.author = "Angelolz";
RPC.version = "1.0";
RPC.gameVersion = "2.042";

RPC.launch = function()
{

	RPC.defaultConfig = function() {
		return {
			ASCEND_LONG_SCALE: 1,
			COOKIES_LONG_SCALE: 0,
			SHOW_ELAPSED_TIME: 1
		}
	}

	RPC.init = function() {
		RPC.isLoaded = 1;
		// RPC.replaceGameMenu();
		RPC.setupWebSocket();
		// RPC.checkUpdate(); TODO enable this
	}

	RPC.config = RPC.defaultConfig();

	// RPC.getMenuString = function()
	// {
	// 	let m = CCSE.MenuHelper;
	// }

	RPC.setupWebSocket = function ()
	{
		RPC.ws = new WebSocket("ws://localhost:6969/");

		RPC.ws.onopen = function (event)
		{
			console.log("[cc-rpc] established connection to websocket")
			RPC.wsCon = true;
			Game.registerHook('check', sendData);
			Game.Notify("Started Rich Presence Server!", "", [5,5], 6, false);
		};

		RPC.ws.onclose = function (event) {if(RPC.wsCon) { lostConnection(); }}

		RPC.ws.onerror = function (event)
		{
			Game.Notify("Couldn't connect to Rich Presence Server!", "Please check if the app is open.", [1,7]);
			Game.registerHook('check', reconnect);
		}
	}

	RPC.save = function()
	{
		return JSON.stringify(RPC.config);
	}

	RPC.load = function(str)
	{
		RPC.config = JSON.parse(str);
		//maybe do some other things?
	}

	RPC.checkUpdate = async function ()
	{
		//TODO change URL
		var res = await fetch("https://api.github.com/repos/angelolz1/CookieClickerRPC/releases/latest");
		var json = await res.json();

		if(json.tag_name != CookieAssistant.version)
		{
			//TODO notify that there's a new version and provide download link
		}
	}

	// HELPER FUNCTIONS
	function getScale(index, useLong)
	{
		//thank you cookie monster mod <3

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

	function nFormat(num)
	{
		//ty again cookie monster mod :DDDD
		let answer;
		const exponential = num.toExponential().toString();
		const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
		answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
		answer += " " + getScale(AmountOfTenPowerThree);
		return answer;
	}

	function getDrops(season)
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
				return "69/420 c00kiez";
			default:
				return 0;
		}
	}

	// WEBSOCKET FUNCTIONS
	function sendData()
	{
		ws.send(
			`{
			"cookies": "${nFormat(Game.cookies)}",
			"cps":"${nFormat(Game.cookiesPsRaw)}",
			"prestige_lvl":"${Game.prestige.toString()}",
			"resets":"${Game.resets.toString()}",
			"season":"${Game.season}",
			"drops":"${getDrops(Game.season)}"
		}`);
	}

	function lostConnection()
	{
		console.log("[cc-rpc] Lost connection to websocket and reconnecting...")
		wsCon = false; ws = null;
		Game.Notify("Lost connection with Rich Presence Server!", "Check to see if the app is open. Reconnecting...", [1,7]);
		Game.removeHook('check', sendData);
		Game.registerHook('check', reconnect);
	}

	function reconnect() {
		if (!wsCon) {
			ws = new WebSocket("ws://localhost:6969/update");

			ws.onopen = function (event) {
				console.log("[cc-rpc] Reconnected to websocket!")
				wsCon = true;
				Game.Notify("Reconnected to Rich Presence Server!", "", [4, 5], 6, false);
				Game.removeHook('check', reconnect);
				Game.registerHook('check', sendData);
			}

			ws.onclose = function (event) {
				if (wsCon) {
					lostConnection();
				}
			}
		}
	}

	if(CCSE.ConfirmGameVersion(RPC.id, RPC.version, RPC.gameVersion))
	{
		Game.registerMod(RPC.id, RPC);
	}
}

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