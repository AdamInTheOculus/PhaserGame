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
import NetworkHandler from '../network_handler.js';
import AnimationHandler from '../animation_handler.js';

class MultiplayerGameScene extends Phaser.Scene {

    constructor() {
        super({
            key: 'MultiplayerGameScene'
        });
        this.ids = constants.ids;
        this.debug = false;
    }

    preload() {
        // this.load.image('background', 'game/assets/backgrounds/landscape.png');         // Load background image.
        // this.load.image('game_tiles', 'game/assets/tilesets/platformer_1.png');         // Load Tiled tileset.
        // this.load.image('blue_orb', 'game/assets/triggerables/blue_orb.png');           // Load FlightOrb image.
        // this.load.image('tombstone', 'game/assets/triggerables/tombstone.png');         // Load Tombstone image.
        // this.load.image('question_mark', 'game/assets/triggerables/question_mark.png'); // Load QuestionMark image.
        // this.load.tilemapTiledJSON('map_1', 'game/assets/maps/adam-test_base64.json');         // Load Tiled map.
        // this.load.spritesheet('dude', 'game/assets/spritesheets/dude.png', {            // Load spritesheet for player.
        //     frameWidth: 32, frameHeight: 48
        // });
        this.load.spritesheet('fireball', 'game/assets/spritesheets/fireball.png', {            // Load spritesheet for player.
            frameWidth: 134, frameHeight: 134
        });
        this.load.spritesheet('ice', 'game/assets/spritesheets/ice.png', {            // Load spritesheet for player.
            frameWidth: 192, frameHeight: 192
        });
        this.load.image('fireball_spell_icon', 'game/assets/icons/fireball_spell_icon.png');
        this.load.image('ice_spell_icon', 'game/assets/icons/ice_spell_icon.png');
    }

    create() {

        this.inputHandler = new InputHandler(this.input);
        this.networkHandler = new NetworkHandler(this);
        this.animationsHandler = new AnimationHandler(this);
        this.graphicsHandler = this.add.graphics();

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
        this.layers.flightOrbs = map.getObjectLayer('Collectables')['objects'];

        // Set up groups
        this.groups.endPoints = this.physics.add.staticGroup();
        this.groups.flightOrbs = this.physics.add.staticGroup();

        this.scene.bringToTop('GUIScene');
        this.guiScene = this.scene.get('GUIScene');

        this.networkHandler.registerSocketListeners();

        // Set up flight orb triggerables
        // this.layers.flightOrbs.forEach(flightOrb => {
        //     let orb = this.groups.flightOrbs.create(flightOrb.x, flightOrb.y, 'blue_orb');
        //     orb.body.width = flightOrb.width;
        //     orb.body.height = flightOrb.height;
        //     orb.key = 'ice';
        // });

        // Set up endpoint (tombstone) triggerables
        this.layers.endPoints.forEach(endpoint => {
            let tombstone = this.groups.endPoints.create(endpoint.x, endpoint.y, 'tombstone');
            tombstone.body.width = endpoint.width;
            tombstone.body.height = endpoint.height;
        });

        this.animationsHandler.setupAnimations();

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

        this.inputHandler.update();
        this.player.update(time, this.inputHandler.getState());

        this.guiScene.updateCollisionText(this.player.collider);
        this.guiScene.showLatency(this.networkHandler.latency);

        // ===================================================
        // == Reset player position after falling off world ==
        // ===================================================
        // if(this.player.sprite.y > 1375) {

        //     // Shake camera when player reaches out-of-bounds.
        //     this.cameras.main.shake(1000, 0.02, null, (camera, progress) => {
        //         if(progress >= 1) {
        //             let spawnPoint = this.getRandomSpawnPoint();
        //             this.player.sprite.setVelocityY(0);
        //             this.player.sprite.setVelocityX(0);
        //             this.player.sprite.x = spawnPoint.x;
        //             this.player.sprite.y = spawnPoint.y;
        //         }
        //     });
        // }

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
        let key = orb.key;
        orb.destroy(orb.x, orb.y);
        player.setVelocityY(-500); // Give player flight boost.

        if(id === this.player.id) {
            this.player.addExtraJump();
            this.player.collectSpell(key);
            this.player.updateSpellStock(key);
            this.guiScene.updateSpellsInventory(this.player.spells)
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
