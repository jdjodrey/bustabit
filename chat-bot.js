// usage: !risk <base bet> <cash out> <loss x> <max bet>
function lossProb(cash_out)
{
    var amount = 1; // what is this for?
    var factor = Math.ceil(100 * cash_out / amount);
    var win_prob = (9900 / (101 * (factor - 1))) * 100;
    return 100 - win_prob;
}

engine.on('msg', function(data)
{
	// only respond to bot commands
	if (!data.bot) return;
	
	var msg = data.message;
	
	if (msg.indexOf("!risk") === 0)
	{
		// check args
		var args = msg.split(" ");
		if (args.length !== 5)
		{
			console.log('usage: !risk <base bet> <cash out> <loss x> <max bet>');
			return;
		}
		
		var base_bet = parseFloat(args[1]);
		var cash_out = parseFloat(args[2]);
		var loss_x   = parseFloat(args[3]);
		var max_bet  = parseFloat(args[4]);
		
		if (isNaN(base_bet) || isNaN(cash_out) || isNaN(loss_x) || isNaN(max_bet))
		{
			console.log('Um, I need numbers bro. Something like this: !risk 10 1.25 4 1200');
			return;
		} 
		else if (base_bet <= 0)
		{
			console.log('Base bet must be > 0');
			return;
		}
		
		var max_loss_streak = 0;
		var current_bet = base_bet;
		while (current_bet <= max_bet)
		{
			max_loss_streak++;
			current_bet = current_bet * loss_x;
		}
			
		console.log("You're safe against " + max_loss_streak + " consectutive losses");
		
		var loss_prob = lossProb(cash_out);
		var streak_odds = Math.pow(loss_prob, (max_loss_streak + 1)) * 100;
		
		console.log("Probability of " + (max_loss_streak + 1) + " loss streak at " + cash_out + "x is: " + streak_odds.toFixed(5) + "%"); 
	}
});