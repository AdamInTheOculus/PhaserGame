/**
 * @author   AdamInTheOculus  
 * @date     April 13th 2019
 * @purpose  Contains all data and logic of GameManager class.
**/

module.exports = class GameManager {

    constructor() {
        this.players = {};       // Represents list of current players, mapped by socket id.
        this.heartbeat = 1000;   // Represents time (in ms) between each emit to all clients. (1000 / 33.3 === 30 emits per second)
        this.intervalId = 0;     // Represents Id from setInterval function.
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
    addPlayer(obj) {
        if(obj === undefined || obj === null || typeof obj !== 'object') {
            return;
        }

        if(this.players[obj.id] !== undefined) {
            console.log(`GameManager.addPlayer -- Warning -- Player id [${obj.id}] already exists. Nothing added.`);
            return;
        }

        this.players[obj.id] = obj;
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