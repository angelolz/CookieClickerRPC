/*jshint esversion: 6 */

let ws, wsCon;

Game.registerMod("cc-rpc",{
	init:function()
	{
		ws = new WebSocket("ws://localhost:6969/update");

		ws.onopen = function (event) {
			console.log("[cc-rpc] established connection to websocket")
			wsCon = true;
			Game.registerHook('check', sendData);
			Game.Notify("Started Rich Presence Server!", "", [5,5], 6, false);
		};

		ws.onclose = function (event) {if(wsCon) { lostConnection(); }}

		ws.onerror = function (event) {
			Game.Notify("Couldn't connect to Rich Presence Server!", "Please check if the app is open.", [1,7]);
			Game.registerHook('check', reconnect);
		}
	}
});

function getScale(index)
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

	return longScale[index];
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
	Game.Notify("Lost connection with Rich Presence Server!", "Check to see if the app is open. Reconnecting...", [1,7);
	Game.removeHook('check', sendData);
	Game.registerHook('check', reconnect);
}

function reconnect()
{
	if(!wsCon)
	{
		ws = new WebSocket("ws://localhost:6969/update");

		ws.onopen = function(event) {
			console.log("[cc-rpc] Reconnected to websocket!")
			wsCon = true;
			Game.Notify("Reconnected to Rich Presence Server!", "", [4,5], 6, false);
			Game.removeHook('check', reconnect);
			Game.registerHook('check', sendData);
		}

		ws.onclose = function (event) {if(wsCon) { lostConnection(); }}
	}
}

function getDrops(season)
{
	switch(season)
	{
		case "halloween":
			return `${Game.GetHowManyHalloweenDrops()}/${Game.halloweenDrops.length} halloween cookies`;
		case "christmas":
			return `${Game.GetHowManySantaDrops()}/${Game.santaDrops.length} gifts
				and ${Game.GetHowManyReindeerDrops()}/${Game.reindeerDrops.length} cookies`;
		case "valentines":
			return `${Game.GetHowManyHeartDrops()}/${Game.heartDrops.length} heart biscuits`;
		case "easter":
			return `${Game.GetHowManyEggs()}/${Game.easterEggs.length} eggs`;
		case "fools":
			return "69/420 cookeis";
		default:
			return 0;
	}
}
