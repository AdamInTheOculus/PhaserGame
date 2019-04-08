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

app.use(express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { 'root': 'public/src/'});
});

io.on('connection', (socket) => {

    console.log(`A user has connected ...`);
    console.log(Object.keys(socket));

    socket.on('disconnect', () => {
        console.log(`A user has disconnected.`);
    });
});

server.listen(9001, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});