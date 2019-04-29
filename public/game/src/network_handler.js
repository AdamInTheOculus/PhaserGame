/**
 * @author   AdamInTheOculus
 * @date     April 25th 2019
 * @purpose  Contains all methods related to networking and communicating with game server.
 **/

import Player from './player.js';

class NetworkHandler {
    constructor(scene) {
        this.socket = io();
        this.scene = scene;
        this.heartbeatInterval = 16.6;
    }

    /**
     * @author    AdamInTheOculus
     * @date      April 25th 2019
     * @purpose   Creates listeners for any incoming server events.
    **/
    registerSocketListeners() {
        this.onPlayerConnects();
        this.onPlayerDisconnects();
        this.onServerHeartbeat();
    }

    /**
     * @author    AdamInTheOculus
     * @date      April 25th 2019
     * @purpose   Creates socket emitter on a timed interval. Sends local player information.
    **/
    registerPlayerUpdate() {
        setInterval( () => {
                this.socket.emit('player_update', {
                    id: this.socket.id,
                    position: {
                        x: this.scene.player.x,
                        y: this.scene.player.y
                    },
                    state: this.scene.player.state
                });
            },  this.heartbeatInterval
        );
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Creates new player sprite. Used when new player connects to server.
    **/
    registerNewPlayer(playerId) {

        let spawnPoint = this.scene.getRandomSpawnPoint();
        let sprite = this.scene.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude');
        sprite.setGravityY(300);

        let player = new Player({
            scene: this.scene,
            id: playerId,
            name: playerId,
            sprite: sprite,
            spawnPoint: spawnPoint,
            key: 'dude'
        });

        this.scene.physics.add.collider(player, this.scene.layers.ground, () => { if(player.body.blocked.down){ player.canJump = true; player.canDoubleJump = false; }});
        this.scene.physics.add.overlap(player, this.scene.groups.collectables, (obj1, obj2) => { this.scene.collideWithCollectable(player.id, obj1, obj2); }, null, this);
        this.scene.physics.add.overlap(player, this.scene.groups.endPoints, (obj1, obj2) => { this.scene.collideWithTombstone(player.id, obj1, obj2); }, null, this);
        this.scene.physics.add.collider(player, this.scene.enemies, (obj1, obj2) => { this.scene.collideWithEnemy(player.id, obj1, obj2); }, null, this);

        return player;
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Listener logic when new player connects to the server.
    **/
    onPlayerConnects() {
        this.socket.on('player_new', (data) => {

            // =================================================
            // == Handle when local player connects to server ==
            // =================================================
            if(this.socket.id === data.player.id) {
                this.scene.player = this.registerNewPlayer(this.socket.id);
                this.scene.cameras.main.startFollow(this.scene.player);
                this.registerPlayerUpdate();
            }

            // =================================================
            // == Handle when other players connect to server ==
            // =================================================
            let clientPlayerIdList = Object.keys(this.scene.players);
            Object.keys(data.playerList).forEach((id) => {

                // Ignore local player.
                if(this.scene.player.id === id) {
                    return;
                }

                // Ignore players who have already been created on client.
                if(clientPlayerIdList.includes(id)) {
                    return;
                }

                this.scene.players[id] = this.registerNewPlayer(id);
            });

            // ================================================
            // == Create/update text displaying player count ==
            // ================================================
            this.scene.guiScene.updatePlayerList(Object.keys(this.scene.players).length + 1); // +1 for client player
        });
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Listener logic when player disconnects from server.
    **/
    onPlayerDisconnects() {
        this.socket.on('player_disconnect', (id) => {

            // ======================================
            // == Handle when a player disconnects ==
            // ======================================
            if(this.scene.players[id] !== undefined) {

                // Clean up username
                this.scene.players[id].nameUI.destroy();
                this.scene.players[id].sprite.destroy();

                delete this.scene.players[id];

                // Update player list count
                console.log(this.scene.guiScene);
                this.scene.guiScene.updatePlayerList(Object.keys(this.scene.players).length + 1); // +1 for client player
            }
        });
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Listener logic when server sends updated game state.
     * @todo     THIS WILL BE RE-WRITTEN ONCE AUTHORITATIVE SERVER IS IMPLEMENTED.
    **/
    onServerHeartbeat() {
        this.socket.on('player_update', (players) => {
            Object.keys(players).forEach(id => {

                if(this.scene.players[id] === undefined) {
                    return;
                }

                // Update player position from server data.
                this.scene.players[id].x = players[id].position.x;
                this.scene.players[id].y = players[id].position.y;

                // Update player state
                this.scene.players[id].state = players[id].state;
                this.scene.players[id].updatePlayerAnimation();

                // Display name above player.
                if(this.scene.players[id].nameUI === undefined) {
                    this.scene.players[id].nameUI = this.scene.add.text(this.scene.players[id].sprite.x - 75, this.scene.players[id].sprite.y - 40, this.scene.players[id].name, {fill: '#FFF', fontSize: 14});
                } else {
                    this.scene.players[id].nameUI.setPosition(this.scene.players[id].sprite.x - 75, this.scene.players[id].sprite.y - 40);
                }
            });
        });
    }
}

export default NetworkHandler;
