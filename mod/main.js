/*jshint esversion: 6 */

//websocket vars
let ws, wsCon;

//config vars
let ascendLongScale, cookiesLongScale, elapsedTime;

Game.registerMod("cc rpc",{
	init:function()
	{
		//get preferenes
		ascendLongScale = localStorageGet("ascendLongScale") == null ? true : false;
		cookiesLongScale = localStorageGet("cookiesLongScale") == null ? false : true;
		elapsedTime = localStorageGet("elapsedTime") == null ? false : true;

		//setup websocket server
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

		//setup menu
		this.setupMenu();
	},

	setupMenu: function()
	{
		const gameMenu = Game.UpdateMenu;
		const MOD = this;
		Game.UpdateMenu = function ()
		{
			gameMenu();
			if(Game.onMenu == 'prefs')
			{
				let menuHTML = l('menu').innerHTML;

				menuHTML = menuHTML.replace(
					'<div style="height:128px;"></div>',
					'<div class="framed" style="margin:4px 48px;">' +
						'<div class="block" style="padding:0px;margin:8px 4px;">' +
							'<div class="subsection" style="padding:0px;">' +
								MOD.modMenu() +
							'</div>' +
						'</div>' +
					'</div>' +
					'<div style="height:128px;"></div>'
				);

				menu.innerHTML = menuHTML;
			}
		}
	},

	modMenu: function()
	{
		return (
			'<div class="title">Rich Presence Settings</div>' +
			`<div class="listing">
				${this.button("ascendLongScale", "Long Scale for Ascension Info",
					"Change the scale for your Prestige Level and number of Ascends.")}
				<br>
				${this.button("cookiesLongScale", "Short Scale for Cookie Info",
					"Change the scale for your Cookies in Bank and Cookies per Second.")}
				<br>
				${this.button("elapsedTime", "Elapsed Time ON",
					"Show how long you've been playing this session on your Rich Presence Status.")}
			</div>`
		);
	},

	button: function (id, text, label)
	{
		return(`<a class="smallFancyButton option on" id="${id}" ${loc(Game.clickStr)}="MOD.changeOption(${id})">${text}</a>` +
			   `<label>${label}</label>`);
	},

	changeOption: function(option)
	{

	}
});

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
