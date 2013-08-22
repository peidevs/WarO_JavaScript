WARO = (function (doc) {
    var _numberOfPlayers = 0;
    var _players = [];
    var _kitty = null;

    var createGame = function (numberOfRounds, players) {
        var STATE = {
         INVALID: "Invalid",
         IN_PROGRESS: "In progress",
         FINISHED: "Finished"
        };

        var _state = STATE.INVALID;
        var _players = players.slice(0);

        var _playerHands = [];
        var _rounds = [];
        var _currentRound = 0;

        var _playersOK = (_players != null) && (_players.length > 1);

        console.log("Current player count: " + _players.length);
        console.log("Number of rounds to play: " + numberOfRounds);

        var isInvalid = function () {
            return STATE.INVALID === _state;
        };

        var isInProgress = function () {
            return STATE.IN_PROGRESS === _state;
        };

        var isFinished = function () {
            return STATE.FINISHED === _state;
        };

        var getPlayerList = function () {
            var playerNames = [];

            for (var playerIndex = 0; playerIndex < _players.length; playerIndex++) {
                playerNames.push(_players[playerIndex].getName());
            }

            return playerNames;
        };

        var acceptPlayerBid = function (playerNumber, bid) {
            _rounds[_currentRound].acceptBid(playerNumber, bid);

        };

        var handleRoundComplete = function (roundEvent) {
            _currentRound++;

            if (_currentRound === _rounds.length) {
                console.log("Game is FINISHED!");
                _state = STATE.FINISHED;
            } else {
                console.log("Initiate round " + _currentRound);
                initiateRound();
            }
        };

        var initiateRound = function () {
            var kittyValue = _rounds[_currentRound].getKittyValue();
            console.log("Kitty Value for Round " + _currentRound + " is " + kittyValue);
            for (var playerIndex = 0; playerIndex < _players.length; playerIndex++) {
                // Give players the next kitt value and ask for bids
                var playerHand = _playerHands[playerIndex];
                _players[playerIndex].signalNextBid(kittyValue, acceptPlayerBid, playerHand);
            }

        };
        // Register RoundFinished event listener
        doc.addEventListener("roundEvent", handleRoundComplete, false);

        if (_playersOK && (numberOfRounds > 0)) {
            _players = players.slice(0);
            _state = STATE.IN_PROGRESS;

            var deckSize = numberOfRounds * (1 + _players.length);
            var deck = createDeck(deckSize);
            var shuffledDeck = shuffleDeck(deck);
            var splits = splitDeck(shuffledDeck, _players.length + 1);

            // Player hands are the first N splits of the split deck
            _playerHands = splits.slice(1);

            var kitty = splits[0];

            for ( var roundIndex = 0; roundIndex < kitty.length; roundIndex++) {
                _rounds.push(createRound(kitty[roundIndex], _players.length));
            }

            for (var playerNumber  = 1; playerNumber <= _players.length; playerNumber++) {
                _players[playerNumber - 1].setNumber(playerNumber);
            }

            console.log("Game is " + _state);

        } else {
            _state = STATE.INVALID;
        }

        return {isInvalid: isInvalid,
            isInProgress: isInProgress,
            isFinished: isFinished,
            getPlayerList: getPlayerList,
            acceptPlayerBid: acceptPlayerBid,
            initiateRound: initiateRound
        };
    };

    var createPlayer = function (name) {
        var _name = name;
        var _hand = [];
        var _number = -1;
        var _currentKittyValue = -1;
        var _game = null;

        var getName = function () {
            return name;
        };

        var getHand = function () {
            return _hand.slice(0);
        };

        var getNumber = function () {
            return _number;
        };

        var setNumber = function (number) {
            _number = number;
        };

        var signalNextBid = function (kittyValue, setNextBidFunction, hand) {
            console.log("Kitty Value is: " + kittyValue + " for player " + _name);
            _hand = hand;
            _currentKittyValue = kittyValue;
            setNextBidFunction(_number, _hand.pop());
        };

        var setGame = function () {
            _game = game;
        };

        return {getName: getName,
            getHand: getHand,
            getNumber: getNumber,
            setNumber: setNumber,
            signalNextBid: signalNextBid,
            setGame: setGame
        };
    };

    var createDeck = function (cards) {
        var deck = [];

        for(var initIndex = 0; initIndex < cards; initIndex++) {
            deck[initIndex] = initIndex + 1;
        }

        return deck;
    };

    var shuffleDeck = function (deck) {
        // From: http://stackoverflow.com/a/6274398/418969 
        var shuffledDeck = deck.slice(0); // naive clone
        var counter = shuffledDeck.length;
        var temp, index;

        while (counter--) {
            index = (Math.random() * counter) | 0;

            temp = shuffledDeck[counter];
            shuffledDeck[counter] = shuffledDeck[index];
            shuffledDeck[index] = temp;
        }

        return shuffledDeck;
    };

    var splitDeck = function (deck, splitSize) {
        var splits = [];

        for (var deckIndex = 0, splitIndex = 0; deckIndex < deck.length; deckIndex += splitSize, splitIndex++) {
            splits[splitIndex] = deck.slice(deckIndex, deckIndex + splitSize);
        }

        return splits;
    };

    var createRound = function (kittyValue, playerCount) {
        var _kittyValue = kittyValue;
        var _playerCount = playerCount;
        var _playerBids = [];

        var getKittyValue = function() {
            return _kittyValue;
        };

        var isFinished = function () {
            return _playerCount === _playerBids.length;
        };

        var getWinner = function () {
            var winner = -1;
            var bidValue = -1;
            var currentHighest = -1;

            if (isFinished()) {
                for (var bidIndex = 0; bidIndex < _playerBids.length; bidIndex++) {
                    bidValue = _playerBids[bidIndex].bid;

                    if (bidValue > currentHighest) {
                        currentHighest = bidValue;
                        winner = _playerBids[bidIndex].number;
                    }
                }
            }

            return winner;
        };

        var acceptBid = function (playerNumber, bidValue) {
            _playerBids.push({number: playerNumber, bid: bidValue});

            console.log("Bids received: " + _playerBids.length + " / Total Bids Needed: " + _playerCount);

            if (isFinished()) {
                var roundEvent = doc.createEvent("Event");
                roundEvent.initEvent("roundEvent", true, true);

                roundEvent.winner = getWinner();

                console.log("Winner: " + roundEvent.winner);

                doc.dispatchEvent(roundEvent);
            }
        };

        return {getKittyValue: getKittyValue,
            isFinished: isFinished,
            acceptBid: acceptBid,
            getWinner: getWinner
        };
    };

    return {createPlayer: createPlayer,
        createDeck: createDeck,
        shuffleDeck: shuffleDeck,
        splitDeck: splitDeck,
        createGame: createGame,
        createRound: createRound
    };
} (document) );

$( document ).ready(function() {
    var players = [];
    var game = null;

    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    players.push(WARO.createPlayer("Cassie"));
    players.push(WARO.createPlayer("Dave"));

    game = WARO.createGame(10, players);
    game.initiateRound();



});
