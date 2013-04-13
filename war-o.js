var numberOfPlayers = 3;
var maxValue = 60;

function shuffle(o){ //v1.0
    for(var j, x, i = o.length; i; j = parseInt(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function createPlayer() {
	return { 
		hand : [],
		winnings : [],
		initialize : function () {
			this.hand.sort(function(a,b){return b-a});
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
			})
			return total;
		}
	};
}

$( document ).ready(function() {

	var deck = [];
	
	for (var i = 0; i < 60; i++) {
		deck[i] = i + 1;
	}

	deck = shuffle(deck);
	
	var players = new Object();
	var kitty = [];
	
	for (var i = 0 ; i < numberOfPlayers ; i++ ) { 
		players[i] = createPlayer();
	}
	
	var counter = 0;
	
	for (var i = 0 ; i < maxValue ; i++) {
		if (counter === numberOfPlayers){
			kitty.push(deck.pop())
			counter = 0;
		} else {
			players[counter].hand.push( deck.pop() );
			counter++;
		}
	}
	
	for (var i in players ) {
			$('#before-init').append('<div style="float : left; padding: 3em;" id="init-player' + i +'"></div>');
			
			for (var playerIndex in players[i].hand) {
				$('#init-player' + i).append(players[i].hand[playerIndex] +'<br />');
			}
		}
		
		$('#before-init').append('<div style="float : left;  padding: 3em; color: red;" id="kitty" />');
		for (var i in kitty) {
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
