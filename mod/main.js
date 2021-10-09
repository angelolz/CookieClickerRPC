Game.registerMod("cc-rp",{
	init:function()
	{
		let ws = new WebSocket("ws://localhost:6969/update");

		ws.onopen = function (event) {
            Game.registerHook('check', function() {
				ws.send(`{"cookies": "${nFormat(Game.cookies)}","cps":"${nFormat(Game.cookiesPsRaw)}","prestige_lvl":"${Game.prestige.toString()}"}`);
			});
        };
	}
});

function getScale(index)
{
	//shout out cookie monster mod

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

	//TODO make option to toggle between both scales
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
	let answer = '';
	const exponential = num.toExponential().toString();
	const AmountOfTenPowerThree = Math.floor(exponential.slice(exponential.indexOf('e') + 1) / 3);
	answer = (num / Number(`1e${AmountOfTenPowerThree * 3}`)).toFixed(3);
	answer += " " + getScale(AmountOfTenPowerThree);
	return answer;
}
