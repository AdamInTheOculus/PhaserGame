/**
 * @author   AdamInTheOculus
 * @date     April 13th 2019
 * @purpose  Contains all data and logic of GameManager class.
**/

const Player = require('./Player.js');
const TiledMap = require('./TiledMap.js');

module.exports = class GameManager {

    /**
     * @param  config - Config data for the GameManager.
     *         config.heartbeat - Interval rate (in ms) to send data to clients.
     *         config.file      - Name of file with map data.
    **/
    constructor(config) {
        this.players = {};
        this.enemies = {};
        this.pickups = {};
        this.projectiles = {};
        this.heartbeat = config.heartbeat | 40;
        this.map = new TiledMap(config.file);
        this.commandQueue = [];

        this.lag = 0;
        this.previousFrameTime = Date.now();
    }

    loop() {

        const MS_PER_UPDATE = 15;

        let current = Date.now();
        let elapsed = current - this.previousFrameTime;
        this.previousFrameTime = current;
        this.lag += elapsed;

        while(this.lag >= MS_PER_UPDATE) {
            this.update(MS_PER_UPDATE);
            this.lag -= MS_PER_UPDATE;
        }
    }

    update(delta) {

        // ================================================
        // == Execute client commands and update players ==
        // ================================================
        while(this.commandQueue.length > 0) {
            let command = this.commandQueue.shift(); // Remove first element from queue

            switch(command.data) {
                case 1: console.log(`[${command.id}] Moving left.`); this.players[command.id].moveLeft(delta); break;
                case 2: console.log(`[${command.id}] Moving right.`); this.players[command.id].moveRight(delta); break;
                case 3: console.log(`[${command.id}] Jumping.`); break;
                case 4: console.log(`[${command.id}] Idling.`); break;
                default: ;
            }
        }

        // ========================
        // == Update projectiles ==
        // ========================

        // ====================
        // == Update enemies ==
        // ====================
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Set up heartbeat emits to specific client.
    **/
    setupHeartbeatInterval(socket) {
        if(socket === undefined || socket === null) {
            throw new Error('initializeHeartbeat() failed. `socket` is undefined or null.');
        }

        setInterval(() => {
                socket.emit('heartbeat', this.getGameSnapshot());
            },
            this.heartbeat
        );
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Returns necessary data for specific player from current state of game.
    **/
    getGameSnapshot() {
        return this.players;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 13th 2019
     * @purpose  Adds a new player to the players object.
    **/
    addPlayer(id) {
        if(id === undefined || id.length === 0) {
            return;
        }

        this.players[id] = new Player(id);
        console.log(`User [${id}] has connected ...`);
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 15th 2019
     * @purpose  Update player data from server packet. If server validates new position and velocity, the player is updated.
    **/
    updatePlayer(id, packet) {
        if(packet === undefined || typeof packet !== 'object') {
            return;
        } else if(this.players[id] === undefined) {
            return;
        }

        // TODO: Perform server verification of client player position.
        this.players[id].position = packet.position;
        this.players[id].velocity = packet.velocity;
        this.players[id].state = packet.state;
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

        console.log(`User [${id}] has disconnected.`);
        delete this.players[id]; // Deleting an undefined property is fine.
    }

    /**
     * @author   AdamInTheOculus
     * @date     May 7th 2019
     * @purpose  Returns a random spawnpoint parseed from Tiled map data.
    **/
    getRandomSpawnPoint() {
        let length = this.map.spawnPoints.objects.length;
        let spawn = this.map.spawnPoints.objects[this.getRandomInt(0, length)];
        
        console.log(`Spawning player at (${spawn.x},${spawn.y}})`);

        return {
            x: spawn.x,
            y: spawn.y
        };
    }

    /**
     * @author     AdamInTheOculus
     * @date       May 7th 2019
     * @purpose    Returns random integer between [min, max - 1].
     * @reference  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
    **/
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    }

};
