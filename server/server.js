/**
 * @author   AdamInTheOculus
 * @date     April 8th 2019
 * @purpose  Contains server-side logic for PhaserGame.
**/

const GameManager = require('./game-manager.js');
const gameManager = new GameManager();

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const port = (process.env.PORT || 9001);

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
    console.log(`User [${socket.id}] has connected ...`);
    gameManager.addPlayer({
        id: socket.id
    });

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
    });

    // ==========================================================
    // == Handle when a client emits a generic 'event' message ==
    // ==                                                      ==
    // == NOTE: 'event' is arbitrary. Review client-side code. ==
    // ==========================================================
    socket.on('event', (data) => {
        console.log(`${new Date()} - ${data.message}`);
        console.log(gameManager);
    });
});


// =============================================
// == Bind the port our server will listen to ==
// =============================================
server.listen(port, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});