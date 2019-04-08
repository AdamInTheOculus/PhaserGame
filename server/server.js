/**
 * @file     server.js
 * @date     April 8th 2019
 * @author   AdamInTheOculus
 * @purpose  Contains server-side logic for PhaserGame.
**/

const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io').listen(server);
const port = (process.env.PORT || 9001);

app.use(express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { 'root': 'public/src/'});
});

io.on('connection', (socket) => {

    console.log(`User [${socket.id}] has connected ...`);

    socket.on('disconnect', () => {
        console.log(`User [${socket.id}] has disconnected.`);
    });
});

server.listen(port, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});