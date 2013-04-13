test( "Player.calculateTotal - 0 for New", function () {
	var player = createPlayer();
	
	//test
	var total = player.calculateTotal();
	
	ok( 0 === total, "Passed");
});

test( "Player.calculateTotal - 3 for card values of 1 and 2", function () {
	var player = createPlayer();
	player.winnings.push(1);
	player.winnings.push(2);
	
	//test
	var total = player.calculateTotal();
	
	ok( 3 === total, "Passed");
});

