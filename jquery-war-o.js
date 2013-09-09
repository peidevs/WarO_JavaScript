$( document ).ready(function() {
    var players = [];
    var game = null;

    var signalNextBidPlayer = function (kittyValue, setNextBidFunction, hand) {
        $('#output').append('Kitty Value is: ' + kittyValue + '<br />');
        $('#output').append('Current player hand is: ' + hand + '<br />');
        $('#bidButton').unbind('click');
        $('#bidButton').click(function () {
            setNextBidFunction(humanPlayer.getNumber(), $('#playerBid').val());
        });
    };

    var humanPlayer = WARO.createPlayer("Human Player", signalNextBidPlayer);

    players.push(humanPlayer);
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    players.push(WARO.createPlayer("Cassie"));

    game = WARO.createGame(10, players);
    game.startGame();
});
