WARO = (function ($) {
    // Code goes here
    var numberOfPlayers = 3;
    var numberOfCardsEach = 15;

    // We want the players to have an equal number of cards.
    // The Kitty pile should have the same number of cards as the players (the +1)
    var totalCards = (numberOfPlayers + 1) * numberOfCardsEach;

    createPlayer = function () {
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
    };

    this.createDeck = function (cards) {
        var deck = [];

        for(var initIndex = 0; initIndex < cards; initIndex++) {
            deck[initIndex] = initIndex + 1;
        }

        return deck;
    };

    this.shuffleDeck = function (deck) {
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

    this.splitDeck = function (deck, splitSize) {
        var splits = [];

        for (var deckIndex = 0, splitIndex = 0; deckIndex < deck.length; deckIndex += splitSize, splitIndex++) {
            splits[splitIndex] = deck.slice(deckIndex, deckIndex + splitSize);
        }

        return splits;
    };

    return this;
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
