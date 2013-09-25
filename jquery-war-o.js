$(document).ready(function() {
    var players = [];
    var game = null;

    var signalNextBidPlayer = function (kittyValue, setNextBidFunction, hand) {
        $('#output').append('<br />Kitty Value is: ' + kittyValue + '<br />');
        $.each(players, function () {
            var name = this.getName();
            var number = this.getNumber();
            var playerPoints = game.getScoreForPlayer(number);
            $('#output').append(name + ' has ' + playerPoints + ' points.<br />');
        });

        var bidSelection = $('#playerBid');
        bidSelection.empty();
        $.each(hand, function () {
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

    game = WARO.createGame(5, players, function () {
            var winners = [];
            var winningPoints = -1;
        
            $('#output').append('<br />');
            $.each(players, function () {
                    var name = this.getName();
                    var number = this.getNumber();
                    var playerPoints = game.getScoreForPlayer(number);
                    if (winningPoints < playerPoints) {
                        winners = []; // Reset
                        winners.push(this);
                        winningPoints = playerPoints;
                    } else if (winningPoints === playerPoints) {
                        winners.push(this);
                        winningPoints = playerPoints;
                    }
                    $('#output').append(name + ' has ' + playerPoints + ' points.<br />');
            });
            
            $('#output').append('<br />');
            if (winners.length === 1) {
                $('#output').append('With ' + winningPoints + ' points, ' + winners[0].getName() + ' won!<br />');
            } else {
                $('#output').append('With ' + winningPoints + ' points, the follwing:<br />');
                $.each(winners, function () {
                        $('#output').append(this.getName() + '<br />');
                });
            }
    });
    game.startGame();
});
