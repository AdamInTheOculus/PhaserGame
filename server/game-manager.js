/**
 * @author   AdamInTheOculus  
 * @date     April 13th 2019
 * @purpose  Contains all data and logic of GameManager class.
**/

module.exports = class GameManager {

    constructor() {
        this.players = {};       // Represents list of current players, mapped by socket id.
        this.heartbeat = 33.3;   // Represents time (in ms) between each emit to all clients. (1000 / 33.3 === 30 emits per second)
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
    addPlayer(newPlayer) {
        if(newPlayer === undefined || typeof newPlayer !== 'object') {
            return;
        }

        if(this.players[newPlayer.id] !== undefined) {
            throw new Error(`GameManager.addPlayer -- Warning -- Player id [${newPlayer.id}] already exists. Nothing added.`);
        }

        this.players[newPlayer.id] = newPlayer;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Update player specified by `id` parameter. If server successfully validates new position, the player is updated.
    **/
    updatePlayer(id, position) {
        if(position === undefined || typeof position !== 'object') {
            return;
        } else if(this.players[id] === undefined) {
            return;
        }

        // TODO: Perform server verification of client player position.
        this.players[id].position = position;
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