WARO = (function ($) {
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

        var _playersOK = (_players != null) && (_players.length > 1);

        if (_playersOK && (numberOfRounds > 0)) {
            _players = players.slice(0);
            _state = STATE.IN_PROGRESS;

            var deckSize = numberOfRounds * (1 + _players.length);
            var deck = createDeck(deckSize);
            var shuffledDeck = shuffleDeck(deck);
        } else {
            _state = STATE.INVALID;
        }

        var getPlayers = function () {
            return _players.slice(0);
        }

        var isInvalid = function() {
            return STATE.INVALID === _state;
        };

        var isInProgress = function() {
            return STATE.IN_PROGRESS === _state;
        };

        var isFinished = function() {
            return STATE.FINISHED === _state;
        };

        var getPlayerList = function () {
            var playerNames = [];

            for (var playerIndex = 0; playerIndex < _players.length; playerIndex++) {
                playerNames.push(_players[playerIndex].getName());
            }

            return playerNames;
        };

        return {isInvalid: isInvalid,
            isInProgress: isInProgress,
            isFinished: isFinished,
            getPlayerList: getPlayerList
        };
    };

    var createPlayer = function (name) {
        var _name = name;

        var getName = function () {
            return name;
        };

        return {
            getName: getName
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
        var shuffledDeck = deck.slice(0); // naive clone

        for (var index = deck.length - 1; index > 0; index--) {
            var shuffIndex = Math.floor(Math.random() * (index + 1));
            var temp = shuffledDeck[index];
            shuffledDeck[index] = shuffledDeck[shuffIndex];
            shuffledDeck[shuffIndex] = temp;

            shuffledDeck[shuffIndex] = shuffledDeck[index];
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

        var acceptBid = function (playerNumber, bidValue) {
            _playerBids.push({number: playerNumber, bid: bidValue});
        };

        var getWinner = function () {
            var winner = -1;
            var bidValue = -1;
            var currentHighest = -1;

            for (var  bidIndex = 0; bidIndex < _playerBids.length; bidIndex++) {
                bidValue = _playerBids[bidIndex].bid;

                if (bidValue > currentHighest) {
                    currentHighest = bidValue;
                    winner = _playerBids[bidIndex].number;
                }
            }

            return winner;
        };

        return {
            getKittyValue: getKittyValue,
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
} (jQuery) );

var numberOfPlayers = 3;
var maxValue = 60;

function createPlayer() {
    return { 
        hand : [],
             winnings : [],
             initialize : function () {
                 this.hand.sort(function(a,b) {
                     return b-a;
                 });
             },
             whatToPlay : function (kittyValue) {

                 if ( kittyValue > (maxValue / 2)) {
                     return this.hand.shift();
                 } else {
                     return this.hand.pop();
                 }
             },
             calculateTotal : function () {
                 var total = 0;
                 $.each(this.winnings, function () {
                     total += this;
                 });
                 return total;
             }
    };
}

$( document ).ready(function() {

    var deck = [];

    var i = 0;

    for (i = 0; i < 60; i++) {
        deck[i] = i + 1;
    }

    deck = WARO.shuffleDeck(deck);

    var players = new Object();
    var kitty = [];

    for (i = 0 ; i < numberOfPlayers ; i++ ) { 
        players[i] = createPlayer();
    }

    var counter = 0;

    for (i = 0 ; i < maxValue ; i++) {
        if (counter === numberOfPlayers) {
            kitty.push(deck.pop());
            counter = 0;
        } else {
            players[counter].hand.push( deck.pop() );
            counter++;
        }
    }

    for (i in players ) {
        $('#before-init').append('<div style="float : left; padding: 3em;" id="init-player' + i +'"></div>');

        for (var playerIndex in players[i].hand) {
            $('#init-player' + i).append(players[i].hand[playerIndex] +'<br />');
        }
    }

    $('#before-init').append('<div style="float : left;  padding: 3em; color: red;" id="kitty" />');

    for (i in kitty) {
        $('#kitty').append(kitty[i] +'<br />');
    }

    for (var index in players) {
        players[index].initialize();
        $('#output').append('Initializing Player = ' + index + '<br />');
    }

    for (var kIndex in kitty) {

        kittyValue = kitty[kIndex];

        var highestBidderIndex = -1;
        var highestBid = -1;

        for (var pIndex in players) {

            currentPlayerBid = players[pIndex].whatToPlay(kittyValue);

            if (currentPlayerBid > highestBid) {
                highestBidderIndex = pIndex;
                highestBid = currentPlayerBid;
            }
        }

        $('#output').append('Player ' + highestBidderIndex + ' bid ' + highestBid + ' to win ' + kittyValue + ' points.<br />');

        players[highestBidderIndex].winnings.push(kittyValue);
    }

    for (var finalIndex in players) {
        $('#output').append('Player ' + finalIndex + ' won '+ players[finalIndex].calculateTotal() +' points.<br />');
    }
});
