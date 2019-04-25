/**
 * @author   JonCatalano | AdamInTheOculus
 * @date     April 16th 2019
 * @purpose  Entry point for Phaser 3 multiplayer game.
 */

import Player from '../player.js';
import GUIScene from './GUIScene.js';
import * as constants from '../helpers/constants.js';
import FireBall from '../spells/fireball.js';
import InputHandler from '../input_handler.js';

class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'MultiplayerGameScene'
        });
        this.ids = constants.ids;
    }

    preload() {
        this.load.image('background', 'game/assets/backgrounds/landscape.png');         // Load background image.
        this.load.image('game_tiles', 'game/assets/tilesets/platformer_1.png');         // Load Tiled tileset.
        this.load.image('blue_orb', 'game/assets/triggerables/blue_orb.png');           // Load FlightOrb image.
        this.load.image('tombstone', 'game/assets/triggerables/tombstone.png');         // Load Tombstone image.
        this.load.image('question_mark', 'game/assets/triggerables/question_mark.png'); // Load QuestionMark image.
        this.load.tilemapTiledJSON('map_1', 'game/assets/maps/adam-test.json');         // Load Tiled map.
        this.load.spritesheet('dude', 'game/assets/spritesheets/dude.png', {            // Load spritesheet for player.
            frameWidth: 32, frameHeight: 48
        });
        this.load.image('fireball_spell_icon', 'game/assets/icons/fireball_spell_icon.png');
    }

    create() {

        this.inputHandler = new InputHandler(this.input);

        this.player = undefined;
        this.players = {};

        // ===================================================================
        // == Build world with background image, tilemaps, and game objects ==
        // ===================================================================
        let map = this.make.tilemap({key: 'map_1'});
        let tileset = map.addTilesetImage('platformer_1', 'game_tiles');

        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.layers = {};
        this.groups = {};

        // Set up layers
        this.layers.ground = map.createStaticLayer(0, tileset, 0, 0);
        this.layers.spawnPoints = map.getObjectLayer('SpawnPoints')['objects'];
        this.layers.endPoints = map.getObjectLayer('EndPoints')['objects'];
        this.layers.flightOrbs = map.getObjectLayer('FlightOrbs')['objects'];

        // Set up groups
        this.groups.endPoints = this.physics.add.staticGroup();
        this.groups.flightOrbs = this.physics.add.staticGroup();

        this.scene.bringToTop('GUIScene');
        this.guiScene = this.scene.get('GUIScene');

        // =================================
        // == Set up socket.io connection ==
        // =================================
        this.socket = io(); // Defaults to window.location
        const heartbeatInterval = 16.6; // Every 16.6ms an update is sent to server

        // =========================================
        // == Handle when a player newly connects ==
        // =========================================
        this.socket.on('player_new', (data) => {

            // ============================================
            // == Create client player and attach camera ==
            // ============================================
            if(this.socket.id === data.player.id) {
                this.player = this.createPlayer(this.socket.id, true);
                this.cameras.main.startFollow(this.player.sprite);

                // ======================================
                // == Emit player update every 33.3 ms ==
                // ======================================
                console.log('Setting player update interval!');
                setInterval( () => {

                        this.socket.emit('player_update', {
                            id: this.socket.id,
                            position: {
                                x: this.player.sprite.x,
                                y: this.player.sprite.y
                            }
                        });

                    },  heartbeatInterval
                );

            }

            // ================================================
            // == Create any other players currently in game ==
            // ================================================
            let clientPlayerIdList = Object.keys(this.players);
            Object.keys(data.playerList).forEach((id) => {

                if(this.player.id === id) {
                    return;
                }

                // Ignore players who have already been created on client.
                if(clientPlayerIdList.includes(id)) {
                    return;
                }

                this.players[id] = this.createPlayer(id);
            });

            // ================================================
            // == Create/update text displaying player count ==
            // ================================================
            this.guiScene.updatePlayerList(Object.keys(this.players).length + 1); // +1 for client player
        });

        // ======================================
        // == Handle when a player disconnects ==
        // ======================================
        this.socket.on('player_disconnect', (id) => {
            if(this.players[id] !== undefined) {

                // Clean up username
                this.players[id].nameUI.destroy();
                this.players[id].sprite.destroy();

                delete this.players[id];

                // Update player list count
                this.guiScene.updatePlayerList(Object.keys(this.players).length + 1); // +1 for client player
            }
        });

        // =================================================================================
        // == Handle when player update is received. THIS WILL BE REPLACED WITH heartbeat ==
        // =================================================================================
        this.socket.on('player_update', (players) => {
            Object.keys(players).forEach(id => {

                if(this.players[id] === undefined) {
                    return;
                }

                // Update player position from server data.
                this.players[id].sprite.x = players[id].position.x;
                this.players[id].sprite.y = players[id].position.y;

                // Display name above player.
                if(this.players[id].nameUI === undefined) {
                    this.players[id].nameUI = this.add.text(this.players[id].sprite.x - 75, this.players[id].sprite.y - 40, this.players[id].name, {fill: '#FFF', fontSize: 14});
                } else {
                    this.players[id].nameUI.setPosition(this.players[id].sprite.x - 75, this.players[id].sprite.y - 40);
                }
            });
        });

        // Set up flight orb triggerables
        this.layers.flightOrbs.forEach(flightOrb => {
            let orb = this.groups.flightOrbs.create(flightOrb.x, flightOrb.y, 'blue_orb');
            orb.body.width = flightOrb.width;
            orb.body.height = flightOrb.height;
        });

        // Set up endpoint (tombstone) triggerables
        this.layers.endPoints.forEach(endpoint => {
            let tombstone = this.groups.endPoints.create(endpoint.x, endpoint.y, 'tombstone');
            tombstone.body.width = endpoint.width;
            tombstone.body.height = endpoint.height;
        });

        // =============================
        // == Setup player animations ==
        // =============================
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        // ===================================
        // == Set up collisions and physics ==
        // ===================================
        this.layers.ground.setCollisionByProperty({ collidable: true });

        // ========================================
        // == Bind camera within game boundaries ==
        // ========================================
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    }

    update(time, delta) {

        if(this.player === undefined) {
            return;
        }

        this.player.update(this.inputHandler.getState());

        // ===================================================
        // == Reset player position after falling off world ==
        // ===================================================
        if(this.player.sprite.y > 1375) {

            // Shake camera when player reaches out-of-bounds.
            this.cameras.main.shake(1000, 0.02, null, (camera, progress) => {
                if(progress >= 1) {
                    let spawnPoint = this.getRandomSpawnPoint();
                    this.player.sprite.setVelocityY(0);
                    this.player.sprite.setVelocityX(0);
                    this.player.sprite.x = spawnPoint.x;
                    this.player.sprite.y = spawnPoint.y;
                }
            });
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 16th 2019
     * @purpose
    **/
    createPlayer(playerId) {

        let spawnPoint = this.getRandomSpawnPoint();
        let sprite = this.physics.add.sprite(spawnPoint.x, spawnPoint.y, 'dude');
        sprite.setGravityY(300);

        let player = new Player({
            scene: this,
            id: playerId,
            name: playerId,
            sprite: sprite,
            spawnPoint: spawnPoint
        });

        this.physics.add.collider(player.sprite, this.layers.ground, () => { if(player.sprite.body.blocked.down){ player.canJump = true; player.canDoubleJump = false; }});
        this.physics.add.overlap(player.sprite, this.groups.flightOrbs, (obj1, obj2) => { this.collideWithFlightOrb(player.id, obj1, obj2); }, null, this);
        this.physics.add.overlap(player.sprite, this.groups.endPoints, (obj1, obj2) => { this.collideWithTombstone(player.id, obj1, obj2); }, null, this);

        return player;
    }

    /**
     * @author   AdamInTheOculus
     * @date     March 18th 2019
     * @purpose  Displays debug colouring for tiles, colliding tiles, and faces.
    **/
    displayDebugGraphics(layer) {
        const debugGraphics = this.add.graphics();
        layer.renderDebug(debugGraphics, {
            tileColor:          new Phaser.Display.Color(255, 255, 255, 0),  // Color of non-colliding tiles
            collidingTileColor: new Phaser.Display.Color(243, 134, 48, 150),    // Color of colliding tiles
            faceColor:          new Phaser.Display.Color(40, 39, 37, 0)       // Color of colliding face edges
        });
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Returns a random spawn point from spawn point layer.
    **/
    getRandomSpawnPoint() {
        return this.layers.spawnPoints[this.getRandomInt(0, this.layers.spawnPoints.length)];
    }

    /**
     * @author     AdamInTheOculus
     * @date       April 7th 2019
     * @purpose    Returns random integer between [min, max - 1].
     * @reference  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_integer_between_two_values
    **/
    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; // The maximum is exclusive and the minimum is inclusive
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a player collides with a blue flight orb.
    **/
    collideWithFlightOrb(id, player, orb) {
        orb.destroy(orb.x, orb.y);
        player.setVelocityY(-500); // Give player flight boost.

        if(id === this.player.id) {
            this.player.addExtraJump();
            this.guiScene.updateSpellsInventory(1, 'fireball_spell_icon')
        }
    }

    /**
     * @author   AdamInTheOculus
     * @date     April 7th 2019
     * @purpose  Logic when a players collides with a tombstone.
    **/
    collideWithTombstone(id, player, tombstone) {
        tombstone.destroy(tombstone.x, tombstone.y);

        if(id === this.player.id) {
            alert('You touched the tombstone!');
        } else {
            alert(`${this.players[id].name} touched the tombstone!`);
        }

        location.reload();
    }
}

export default MultiplayerGameScene;
