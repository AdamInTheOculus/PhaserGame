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
        this.heartbeat = config.heartbeat | 40;
        this.map = new TiledMap(config.file);
        this.commandQueue = [];
        this.lag = 0;
        this.previousFrameTime = Date.now();
        this.gravity = 0.00075;
    }

    loop() {

        const MS_PER_UPDATE = 15 / 1000;

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
            let command = this.commandQueue.shift();
            this.players[command.id].state = command.data;
            this.players[command.id].update(delta, this.gravity, this.map);
            this.players[command.id].hasUpdated = true;
        }

        Object.keys(this.players).forEach(id => {
            
            // Don't update players who were previously updated in command queue.
            if(this.players[id].hasUpdated) {
                this.players[id].hasUpdated = false;
                return;
            }

            this.players[id].update(delta, this.gravity, this.map);

            // Reset player position if player falls off world
            if(this.players[id].position.y > 1375) {
                this.players[id].position.x = this.players[id].lastSpawn.x;
                this.players[id].position.y = this.players[id].lastSpawn.y;
                this.players[id].velocity.x = 0;
                this.players[id].velocity.y = 0;
            }
        });

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

        this.players[id] = new Player(id, this.getRandomSpawnPoint());
        console.log(`User [${id}] has connected ...`);
        console.log(`Spawning player at (${this.players[id].position.x},${this.players[id].position.y}})`);
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
