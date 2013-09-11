$(document).ready(function() {
    var players = [];
    var game = null;

    var signalNextBidPlayer = function (kittyValue, setNextBidFunction, hand) {
        $('#output').append('Kitty Value is: ' + kittyValue + '<br />');
        $('#output').append('Current player hand is: ' + hand + '<br />');

        var bidSelection = $('#playerBid');
        bidSelection.empty();
        console.log("Starting to populate select");
        $.each(hand, function () {
            console.log("Looky looky: " + this);
            bidSelection.append($('<option>').val(this).text(this));
        });
        $('#bidButton').unbind('click');
        $('#bidButton').click(function () {
            if (!game.isFinished()) {
                var bidValue = parseInt($('#playerBid').val(), 10);
                setNextBidFunction(humanPlayer.getNumber(), bidValue);
            }
        });
    };

    var humanPlayer = WARO.createPlayer("Human Player", signalNextBidPlayer);

    players.push(humanPlayer);
    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    players.push(WARO.createPlayer("Cassie"));

    game = WARO.createGame(5, players);
    game.startGame();
});
