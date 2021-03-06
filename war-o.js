WARO = (function (doc) {
    var _numberOfPlayers = 0;
    var _players = [];
    var _kitty = null;

    var createGame = function (numberOfRounds, players, customSignalEndOfGame) {
        var STATE = {
            INVALID: "Invalid",
            IN_PROGRESS: "In progress",
            FINISHED: "Finished"
        };

        var _state = STATE.INVALID;
        var _players = players.slice(0);
        
        var _signalEndOfGame = customSignalEndOfGame || function () {
            console.log("End of Game! A Winner is You!");  
        };

        // Create an array and initialize to 0
        var _playerScores = Array.apply(null, new Array(_players.length)).map(Number.prototype.valueOf,0);

        var _playerHands = [];
        var _rounds = [];
        var _currentRound = 0;

        var _playersOK = (_players !== null) && (_players.length > 1);

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
            var roundObj = _rounds[_currentRound];
            
            roundObj.acceptBid(playerNumber, bid);

            var handIndex = playerNumber - 1;
            var hand = _playerHands[handIndex];

            hand = removeNumberFromHand(bid, hand);

            _playerHands[handIndex] = hand;
            
            if (roundObj.isFinished()) {
                var winner = roundObj.getWinner();
                var playerIndex = winner.getNumber() - 1;
                _playerScores[playerIndex] += roundObj.getKittyValue();

                _currentRound++;

                if (_currentRound === _rounds.length) {
                    console.log("Game is FINISHED!");
                    console.log("Player scores: " + _playerScores);
                    
                    _state = STATE.FINISHED;
                    
                    
                    // Signal end of game
                    _signalEndOfGame();
                } else {
                    console.log("Initiate round " + _currentRound);
                    initiateRound();
                }
            }
        };

        var initiateRound = function (roundObject) {
            var roundObj = _rounds[_currentRound];
            var kittyValue = roundObj.getKittyValue();

            var prevRound = null;
            if (_currentRound >= 1) {
                prevRound = _rounds[_currentRound - 1];
            }

            console.log("Kitty Value for Round " + _currentRound + " is " + kittyValue);
            for (var playerIndex = 0; playerIndex < _players.length; playerIndex++) {
                // Give players the next kitty value and ask for bids
                var playerHand = _playerHands[playerIndex].slice(0);
                _players[playerIndex].signalNextBid(kittyValue, acceptPlayerBid, playerHand, prevRound);
            }
        };

        var startGame = function () {
            console.log('Game has started!');

            initiateRound();
        };

        var getScoreForPlayer = function (playerNum) {
            return _playerScores[playerNum - 1];
        };

        if (_playersOK && (numberOfRounds > 0)) {
            _players = players.slice(0);
            _state = STATE.IN_PROGRESS;

            var deckSize = numberOfRounds * (1 + _players.length);
            var deck = createDeck(deckSize);
            var shuffledDeck = shuffleDeck(deck);
            var splits = splitDeck(shuffledDeck, numberOfRounds);

            // Player hands are the first N splits of the split deck
            _playerHands = splits.slice(1);

            var kitty = splits[0];

            for ( var roundIndex = 0; roundIndex < kitty.length; roundIndex++) {
                _rounds.push(createRound(kitty[roundIndex], _players));
            }

            for (var playerNumber  = 1; playerNumber <= _players.length; playerNumber++) {
                _players[playerNumber - 1].setNumber(playerNumber);
            }
        } else {
            _state = STATE.INVALID;
        }

        return {isInvalid: isInvalid,
            isInProgress: isInProgress,
            isFinished: isFinished,
            getPlayerList: getPlayerList,
            acceptPlayerBid: acceptPlayerBid,
            startGame: startGame,
            getScoreForPlayer: getScoreForPlayer
        };
    };

    var createPlayer = function (name, customSignalNextBid) {
        var _name = name;
        var _hand = [];
        var _number = -1;
        var _currentKittyValue = -1;
        var _game = null;

        var getName = function () {
            return name;
        };

        var getNumber = function () {
            return _number;
        };

        var setNumber = function (number) {
            _number = number;
        };

        var signalNextBid = customSignalNextBid || function (kittyValue, setNextBidFunction, hand) {
            _hand = hand;
            _currentKittyValue = kittyValue;
            setNextBidFunction(_number, _hand.pop());
        };

        var setGame = function () {
            _game = game;
        };

        return {getName: getName,
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
        var counter = shuffledDeck.length - 1;
        var temp, index;

        while (counter) {
            index = (Math.random() * counter) | 0;

            temp = shuffledDeck[counter];
            shuffledDeck[counter] = shuffledDeck[index];
            shuffledDeck[index] = temp;
            counter--;
        }

        return shuffledDeck;
    };

    var splitDeck = function (deck, splitSize) {
        var splits = [];

        for (var deckIndex = 0, splitIndex = 0; 
                deckIndex < deck.length; 
                deckIndex += splitSize, splitIndex++) {
                    splits[splitIndex] = deck.slice(deckIndex, deckIndex + splitSize);
                }

        return splits;
    };

    var getPositionInHand = function (number, hand) {
        for (var valPos = 0; valPos < hand.length; valPos++) {
            if (hand[valPos] === number) {
                return valPos;
            }
        }
        return -1;
    };

    var removeNumberFromHand = function (number, hand) {
        var valPos = getPositionInHand(number, hand);

        var result = hand;
        if (valPos >= 0) {
            var half1 = hand.slice(0, valPos);
            var half2 = hand.slice(valPos + 1);
            result = half1.concat(half2);
        }

        return result;
    };

    var createRound = function (kittyValue, players) {
        var _kittyValue = kittyValue;
        var _players = players;
        var _playerBids = [];

        var getKittyValue = function() {
            return _kittyValue;
        };

        var isFinished = function () {
            return _players.length === _playerBids.length;
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
                        winner = _playerBids[bidIndex].player;
                    }
                }
            }

            return winner;
        };

        var acceptBid = function (playerNumber, bidValue) {
            var playerObj = _players[playerNumber - 1];
            _playerBids.push({player: playerObj, bid: bidValue});
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
        createRound: createRound,
        getPositionInHand: getPositionInHand,
        removeNumberFromHand: removeNumberFromHand 
    };
} (document) );

