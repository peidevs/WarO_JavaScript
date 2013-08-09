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

test( "WARO.splitDeck - 4-element array split into length 2 arrays gives 2 splits", function () {
    var deck = [1, 2, 3, 4];

    //test
    var splits = WARO.splitDeck(deck, 2);

    equal(splits.length, 2, "Passed");
});

test( "WARO.splitDeck - 5-element array split into length 1 arrays gives 5 splits", function () {
    var deck = [1,2,3,4,5];

    //test
    var splits = WARO.splitDeck(deck, 1);

    equal(splits.length, 5, "Passed");
});

test( "WARO.splitDeck - 5-element array split into length 5 arrays gives 1 split", function () {
    var deck = [1,2,3,4,5];

    //test
    var splits = WARO.splitDeck(deck, 5);

    equal(splits.length, 1, "Passed");
});

test( "WARO.splitDeck - 6-element array split into length 2 arrays gives first split of 3 elements", function () {
    var deck = [1, 2, 3, 4, 5, 6];

    //test
    var firstSplit = WARO.splitDeck(deck, 2)[0];

    equal(firstSplit.length, 2, "Passed");
});

test( "WARO.splitDeck - 6-element array split into length 4 arrays gives first split of 4 elements", function () {
    var deck = [1, 2, 3, 4, 5, 6];

    //test
    var firstSplit = WARO.splitDeck(deck, 4)[0];

    equal(firstSplit.length, 4, "Passed");
});