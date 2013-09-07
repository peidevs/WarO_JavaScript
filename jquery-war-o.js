$( document ).ready(function() {
    var players = [];
    var game = null;

    players.push(WARO.createPlayer("Alice"));
    players.push(WARO.createPlayer("Bob"));
    players.push(WARO.createPlayer("Cassie"));
    players.push(WARO.createPlayer("Dave"));

    game = WARO.createGame(10, players);
    game.startGame();
});
