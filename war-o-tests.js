test("WARO.createGame - newly created, valid game is In Progress", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));

    // test
    var game = WARO.createGame(1, players);

    var result = game.isInProgress();

    equal(result, true, "Passed");
});

test("WARO.createGame - Not Enough Players goes to Invalid State", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));

    // test
    var game = WARO.createGame(1, players);

    var result = game.isInvalid();

    equal(result, true, "Passed");
});

test("WARO.createGame - Not Enough Rounds goes to Invalid State", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));

    // test
    var game = WARO.createGame(0, players);

    var result = game.isInvalid();

    equal(result, true, "Passed");
});

test("WARO.Game.getPlayerList - listed player has same name she was registered under", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var game = WARO.createGame(1, players);

    // test
    var result = game.getPlayerList();

    equal(result[0], "Alice", "Passed");
});

test("WARO.Game.getPlayerList - 2 returned when 2 are registered", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var game = WARO.createGame(1, players);

    // test
    var result = game.getPlayerList();

    equal(result.length, 2, "Passed");
});

test("WARO.Round.isFinished - Not Finished when no bids", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var round = WARO.createRound(1, players); 

    // test
    var result = round.isFinished();

    equal(result, false, "Passed");
});

test("WARO.Round.isFinished - Not Finished when less bids than players", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var round = WARO.createRound(1, players);
    round.acceptBid(1, 50);

    // test
    var result = round.isFinished();

    equal(result, false, "Passed");
});

test("WARO.Round.isFinished - Finished when all bids accepted", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var round = WARO.createRound(1, players);
    round.acceptBid(1, 50);
    round.acceptBid(2, 50);

    // test
    var result = round.isFinished();

    equal(result, true, "Passed");
});

test("WARO.Round.getWinner - Player 1 bids 100, wins over player 2 bidding 99", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var round = WARO.createRound(1, players);
    round.acceptBid(1, 100);
    round.acceptBid(2, 99);

    // test
    var result = round.getWinner();

    equal(result, 1, "Passed");
});

test("WARO.Round.getWinner - Player 1 bids 100, loses over player 2 bidding 101", function () {
    var players = [];
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    var round = WARO.createRound(1, players);
    round.acceptBid(1, 100);
    round.acceptBid(2, 101);

    // test
    var result = round.getWinner();

    equal(result, 2, "Passed");
});

test("WARO.Round.getWinner - Unfinished game results in -1", function () {
    var round = WARO.createRound(1, 2); // 2 players
    round.acceptBid(1, 100);

    // test
    var result = round.getWinner();

    equal(result, -1, "Passed");
});

test("WARO.createDeck", function () {
    // test
    var deck = WARO.createDeck(60);

    equal(deck.length, 60, "Passed");
});

test("WARO.shuffleDeck - same length", function () {
    var orig = [1,2,3];

    //test
    var shuff = WARO.shuffleDeck(orig);

    equal(shuff.length, orig.length, "Passed");
});

test("WARO.splitDeck - 4-element array split into length 2 arrays gives 2 splits", function () {
    var deck = [1, 2, 3, 4];

    //test
    var splits = WARO.splitDeck(deck, 2);

    equal(splits.length, 2, "Passed");
});

test("WARO.splitDeck - 5-element array split into length 1 arrays gives 5 splits", function () {
    var deck = [1,2,3,4,5];

    //test
    var splits = WARO.splitDeck(deck, 1);

    equal(splits.length, 5, "Passed");
});

test("WARO.splitDeck - 5-element array split into length 5 arrays gives 1 split", function () {
    var deck = [1,2,3,4,5];

    //test
    var splits = WARO.splitDeck(deck, 5);

    equal(splits.length, 1, "Passed");
});

test("WARO.splitDeck - 6-element array split into length 2 arrays gives first split of 3 elements", function () {
    var deck = [1, 2, 3, 4, 5, 6];

    //test
    var firstSplit = WARO.splitDeck(deck, 2)[0];

    equal(firstSplit.length, 2, "Passed");
});

test("WARO.splitDeck - 6-element array split into length 4 arrays gives first split of 4 elements", function () {
    var deck = [1, 2, 3, 4, 5, 6];

    //test
    var firstSplit = WARO.splitDeck(deck, 4)[0];

    equal(firstSplit.length, 4, "Passed");
});

test("WARO.getPositionInHand - Find 77 in the first position and return 0", function () {
    var hand = [77, 2, 3, 4, 5, 6];

    //test
    var result = WARO.getPositionInHand(77, hand);

    equal(result, 0, "Passed");
});

test("WARO.getPositionInHand - Find 77 in the third position and return 2", function () {
    var hand = [1, 2, 77, 4, 5, 6];

    //test
    var result = WARO.getPositionInHand(77, hand);

    equal(result, 2, "Passed");
});

test("WARO.getPositionInHand - Find 77 in the last position and return 5", function () {
    var hand = [1, 2, 3, 4, 5, 77];

    //test
    var result = WARO.getPositionInHand(77, hand);

    equal(result, 5, "Passed");
});

test("WARO.getPositionInHand - Don't find 77 in the hand and return -1", function () {
    var hand = [1, 2, 3, 4, 5, 6];

    //test
    var result = WARO.getPositionInHand(77, hand);

    equal(result, -1, "Passed");
});

test("WARO.removeNumberFromHand - Remove middle from 3-length array - length is now 2", function () {
    var hand = [1, 77, 3];

    //test
    var result = WARO.removeNumberFromHand(77, hand);

    equal(result.length, 2, "Passed");
});

test("WARO.removeNumberFromHand - Remove middle from 3-length array - result[1] is now 3", function () {
    var hand = [1, 77, 3];

    //test
    var result = WARO.removeNumberFromHand(77, hand);

    equal(result[1], 3, "Passed");
});

test("WARO.removeNumberFromHand - Remove first element - first element is old second element", function () {
    var hand = [77, 2, 3];

    //test
    var result = WARO.removeNumberFromHand(77, hand);

    equal(result[0], 2, "Passed");
});

