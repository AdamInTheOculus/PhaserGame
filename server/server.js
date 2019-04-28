/**
 * @author   AdamInTheOculus
 * @date     April 8th 2019
 * @purpose  Contains server-side logic for PhaserGame.
**/

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const port = (process.env.PORT || 3000);

const GameManager = require('./GameManager.js');
const gameManager = new GameManager({
    heartbeat: 16.6, // Send data to client 25 times per second. (1000 / 40 === 25)
    mapFile: 'adam-test_base64.json',
    mapLayer: 'Collidable'
});

const Player = require('./Player.js');

app.use(express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {'root': 'public/src/'});
});

// =================================
// == Handle incoming connections ==
// =================================
io.on('connection', (socket) => {

    // =============================================
    // == Handle when new player connects to game ==
    // =============================================
    let newPlayer = new Player();
    newPlayer.id = socket.id;

    gameManager.addPlayer(newPlayer);
    io.emit('player_new', {
        player: newPlayer,
        playerList: gameManager.getPlayers()
    });
    console.log(`User [${newPlayer.id}] has connected ...`);

    // ============================================================
    // == Set up periodic server emits to newly connected player ==
    // ============================================================
    gameManager.initializeHeartbeat(socket);

    // ==============================================
    // == Handle when player disconnects from game ==
    // ==============================================
    socket.on('disconnect', () => {
        console.log(`User [${socket.id}] has disconnected.`);
        gameManager.removePlayer(socket.id);
        io.emit('player_disconnect', socket.id);
    });

    // ==========================================================
    // == Handle when a client emits a generic 'event' message ==
    // ==                                                      ==
    // == NOTE: 'event' is arbitrary. Review client-side code. ==
    // ==========================================================
    socket.on('event', (data) => {
        console.log(`${new Date()} - ${data.message}`);
    });

    // =========================================================
    // == Handle when client emits player information message ==
    // =========================================================
    socket.on('player_update', (data) => {
        gameManager.updatePlayer(socket.id, data);
        io.emit('player_update', gameManager.getPlayers());
    });

    // ==============================================================================
    // == Handle when client provides player size. This will occur once per player ==
    // ==============================================================================
    socket.on('player_size', (data) => {
        gameManager.getPlayerById(socket.id).size = data.size;
    });

    // ======================================
    // == Handle when client casts a spell ==
    // ======================================
    socket.on('player_cast_spell', (data) => {
        console.log(data);
        socket.broadcast.emit('player_cast_spell', data); // Send to all clients except sender.
    });
});


// =============================================
// == Bind the port our server will listen to ==
// =============================================
server.listen(port, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});
