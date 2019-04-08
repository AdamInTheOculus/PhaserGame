/**
 * @file     server.js
 * @date     April 8th 2019
 * @author   AdamInTheOculus
 * @purpose  Contains server-side logic for PhaserGame.
**/

const express = require('express');
const app = express();
const server = require('http').Server(app);

app.use(express.static('public/'));

app.get('/', (req, res) => {
    res.sendFile('index.html', { 'root': 'public/src/'});
});

server.listen(9001, () => {
    console.log(`Listening on port ${server.address().port} ...`);
});