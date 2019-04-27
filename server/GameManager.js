/**
 * @author   AdamInTheOculus
 * @date     April 13th 2019
 * @purpose  Contains all data and logic of GameManager class.
**/

const TiledMap = require('./TiledMap.js');

module.exports = class GameManager {

    /**
     * @param  config - Config data for the GameManager.
     *         config.heartbeat - Interval rate (in ms) to send data to clients.
     *         config.mapFile   - Name of file with map data.
     *         config.mapLayer  - Name of desired layer within conig.mapFile.
    **/
    constructor(config) {
        this.players = {};
        this.heartbeat = config.heartbeat;
        this.map = new TiledMap(config.mapFile, config.mapLayer);
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Set up heartbeat emits to specific client.
    **/
    initializeHeartbeat(socket) {
        if(socket === undefined || socket === null) {
            throw new Error('initializeHeartbeat() failed. `socket` is undefined or null.');
        }

        setInterval(() => {
                socket.emit('heartbeat', this.getSnapshot());
            },
            this.heartbeat
        );
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Returns current state of game as dictated by the server.
    **/
    getSnapshot() {
        return {
            players: this.players
        };
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 13th 2019
     * @purpose  Adds a new player to the players object.
    **/
    addPlayer(newPlayer) {
        if(newPlayer === undefined || typeof newPlayer !== 'object') {
            return;
        }

        if(this.players[newPlayer.id] !== undefined) {
            throw new Error(`GameManager -- addPlayer -- Player id [${newPlayer.id}] already exists.`);
        }

        this.players[newPlayer.id] = newPlayer;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Update player specified by `id` parameter. If server successfully validates new position, the player is updated.
    **/
    updatePlayer(id, state, position) {
        if(position === undefined || typeof position !== 'object') {
            return;
        } else if(this.players[id] === undefined) {
            return;
        }

        // TODO: Perform server verification of client player position.
        this.players[id].position = position;
        this.players[id].state = state;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 13th 2019
     * @purpose  Returns object of all players currently in game.
    **/
    getPlayers() {
        return this.players;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 13th 2019
     * @purpose  Returns one player specified by `id` parameter. If no player exists, undefined is returned.
    **/
    getPlayerById(id) {
        return this.players[id];
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 13th 2019
     * @purpose  Removes player with specified `id` from players object.
    **/
    removePlayer(id) {
        if(id === undefined || id === null) {
            return;
        }

        delete this.players[id]; // Deleting an undefined property is fine.
    }

};
