/**
 * @author   AdamInTheOculus
 * @date     April 8th 2019
 * @purpose  Contains server-side logic for PhaserGame.
**/

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const port = (process.env.PORT || 9001);

const GameManager = require('./GameManager.js');
const gameManager = new GameManager({
    heartbeat: 10, // Send snapshot to client 100 times per second (1000ms / 10ms === 100)
    file: 'test-map-csv.json'
});

app.use(express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', {'root': 'public/src/'});
});

setInterval(() => {
        gameManager.loop();
    }, 
    15 // 66.7 loops per second
);

// ====================================
// == Set up socket connection logic ==
// ====================================
io.on('connection', (socket) => {

    // Set up periodic server emits to newly connected player
    gameManager.setupHeartbeatInterval(socket);

    // Handle when new player connects to game
    gameManager.addPlayer(socket.id);
    io.emit('player_new', {
        player: gameManager.getPlayerById(socket.id),
        playerList: gameManager.getPlayers()
    });

    // Handle when player disconnects from game
    socket.on('disconnect', () => {
        gameManager.removePlayer(socket.id);
        io.emit('player_disconnect', socket.id);
    });

    // Handle when client provides player size. This will occur once per player.
    socket.on('player_size', (data) => {
        gameManager.getPlayerById(socket.id).size = data.size;
    });

    // Handle when client sends commmand (any type is accepted)
    socket.on('command', (data) => {
        gameManager.commandQueue.push({id: socket.id, data: data});
    });

    socket.on('test', () => {
        socket.emit('pong');
    });
});

// =============================================
// == Bind the port our server will listen to ==
// =============================================
server.listen(port, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});
