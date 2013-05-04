test( "Player.calculateTotal - 0 for New", function () {
	var player = createPlayer();
	
	//test
	var total = player.calculateTotal();
	
	equal(total, 0, "Passed");
});

test( "Player.calculateTotal - 3 for card values of 1 and 2", function () {
	var player = createPlayer();
	player.winnings.push(1);
	player.winnings.push(2);
	
	//test
	var total = player.calculateTotal();
	
	equal(total, 3, "Passed");
});

test( "WARO.createDeck", function () {
    // test
    var deck = WARO.createDeck(60);

    equal(deck.length, 60, "Passed");
});

test( "WARO.shuffleDeck - same length", function () {
    var orig = [1,2,3];

    //test
    var shuff = WARO.shuffleDeck(orig);

    equal(shuff.length, orig.length, "Passed");
});
