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
        this.heartbeatInterval = 25; // (40ms) Send data to server 25 times per second (1000 / 40 === 25).
        this.packetCounter = 0;
        this.latency = 0;
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
        this.onPlayerCastSpell();
        this.onPingToServer();
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 25th 2019
     * @purpose  Creates new player sprite. Used when new player connects to server.
    **/
    registerNewPlayer(networkPlayer) {

        let sprite = this.scene.physics.add.sprite(networkPlayer.position.x, networkPlayer.position.y, 'dude');
        // sprite.setGravityY(300);

        let player = new Player({
            scene: this.scene,
            id: networkPlayer.id,
            name: networkPlayer.id,
            sprite: sprite,
            spawnPoint: networkPlayer.position
        });

        this.scene.physics.add.collider(player.sprite, this.scene.layers.ground, () => { if(player.sprite.body.blocked.down){ player.canJump = true; player.canDoubleJump = false; }});
        this.scene.physics.add.overlap(player.sprite, this.scene.groups.flightOrbs, (obj1, obj2) => { this.scene.collideWithFlightOrb(player.id, obj1, obj2); }, null, this);
        this.scene.physics.add.overlap(player.sprite, this.scene.groups.endPoints, (obj1, obj2) => { this.scene.collideWithTombstone(player.id, obj1, obj2); }, null, this);

        // Send back player size to server. This is important for physics/collision calculations.
        this.socket.emit('player_size', {
            size: {
                w: sprite.displayWidth,
                h: sprite.displayHeight
            }
        });

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
                this.scene.player = this.registerNewPlayer(data.player);
                this.scene.cameras.main.startFollow(this.scene.player.sprite);
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

                this.scene.players[id] = this.registerNewPlayer(data.player);
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
        this.socket.on('heartbeat', (players) => {

            this.packetCounter++;

            Object.keys(players).forEach(id => {
                if(id === this.scene.player.id) {

                    // =========================
                    // == Update local player ==
                    // =========================
                    this.scene.player.sprite.x = players[id].position.x;
                    this.scene.player.sprite.y = players[id].position.y;

                    if(this.packetCounter > 50) {
                        this.packetCounter = 0;
                    }

                    this.scene.player.collider = players[id].collider;
                    this.scene.player.velocity = players[id].velocity;
                    this.scene.player.state = players[id].state;
                    this.scene.player.updatePlayerAnimation();

                } else if(this.scene.players[id] === undefined) {
                    return;
                } else {

                    // ==============================
                    // == Update networked players ==
                    // ==============================
                    this.scene.players[id].sprite.x = players[id].position.x;
                    this.scene.players[id].sprite.y = players[id].position.y;

                    this.scene.players[id].state = players[id].state;
                    this.scene.players[id].updatePlayerAnimation();

                    // Display name above player.
                    if(this.scene.players[id].nameUI === undefined) {
                        this.scene.players[id].nameUI = this.scene.add.text(this.scene.players[id].sprite.x - 75, this.scene.players[id].sprite.y - 40, this.scene.players[id].name, {fill: '#FFF', fontSize: 14});
                    } else {
                        this.scene.players[id].nameUI.setPosition(this.scene.players[id].sprite.x - 75, this.scene.players[id].sprite.y - 40);
                    }
                }  
            });
        });
    }

    /**
     * @author   JonCatalano
     * @date     April 27th 2019
     * @purpose  Send spell cast server information
     * @params   Index, spritePosition, cursorPosition
    **/
    emitSpellCast(data) {

        // DEBUG: Create box at cursor position
        // let rect = new Phaser.Geom.Rectangle(data.cursorPosition.x, data.cursorPosition.y, 50, 50);
        // let graphics = this.scene.add.graphics({ fillStyle: { color: 0x0000ff } });
        // graphics.fillRectShape(rect);

        // setTimeout(() => {
        //     graphics.destroy(this.scene);
        // }, 5000);

        this.socket.emit('player_cast_spell', data);
    }

    /**
     * @author   JonCatalano
     * @date     April 27th 2019
     * @purpose  Receive spell cast server information
     * @params  Index, spritePosition, cursorPosition
    **/
    onPlayerCastSpell(data) {
        this.socket.on('player_cast_spell', (data) => {

            // DEBUG: Create box at cursor position
            // let rect = new Phaser.Geom.Rectangle(data.cursorPosition.x, data.cursorPosition.y, 50, 50);
            // let graphics = this.scene.add.graphics({ fillStyle: { color: 0x0000ff } });
            // graphics.fillRectShape(rect);

            // setTimeout(() => {
            //     graphics.destroy(this.scene);
            // }, 5000);

            this.scene.player.shoot(data);
        });
    }

    onPingToServer() {
        let startTime = 0;
        let _this = this;

        // Set up periodic ping messages to server.
        setInterval(function() {
            startTime = Date.now();
            _this.socket.emit('test');
        }, 1000);

        // Set up listener for ping messages from server.
        this.socket.on('pong', function() {
            _this.latency = (Date.now() - startTime);
        });
    }

    emitCommand(state) {
        this.socket.emit('command', state);
    }

    /**
     * @author     thomas-peter (StackOverflow answer)
     * @date       Apritl 27th 2019
     * @purpose    Utility function to calculate size of Javascript object, in bytes.
     * @reference  https://stackoverflow.com/questions/1248302/how-to-get-the-size-of-a-javascript-object
    **/
    getRoughSizeOfObject( object ) {
        let objectList = [];
        let stack = [ object ];
        let bytes = 0;

        while ( stack.length ) {
            let value = stack.pop();

            if ( typeof value === 'boolean' ) {
                bytes += 4;
            }
            else if ( typeof value === 'string' ) {
                bytes += value.length * 2;
            }
            else if ( typeof value === 'number' ) {
                bytes += 8;
            }
            else if
            (
                typeof value === 'object'
                && objectList.indexOf( value ) === -1
            )
            {
                objectList.push( value );

                for( let i in value ) {
                    stack.push( value[ i ] );
                }
            }
        }
        return bytes;
    }
}

export default NetworkHandler;
