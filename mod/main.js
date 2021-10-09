Game.registerMod("cc-rp",{
	init:function()
	{
		var ws = new WebSocket("ws://localhost:6969/update");

		ws.onopen = function (event) {
            Game.registerHook('check', function() {
				ws.send(`{"cookies": "${nFormat(Game.cookies)}","cps":"${nFormat(Game.cookiesPsRaw)}","prestige_lvl":"${Game.prestige.toString()}"}`);
			});
        };
	}
});

function getScale(index)
{
	longScale = [
	  '',
	  '',
	  'M',
	  'B',
	  'Tr',
	  'Quadr',
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
	let answer = '';
	const exponential = num.toExponential().toString();
	const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
	answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
	answer += " " + getScale(AmountOfTenPowerThree);
	return answer;
}
